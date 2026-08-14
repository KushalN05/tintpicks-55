import fs from 'fs';
import path from 'path';
import https from 'https';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import zlib from 'zlib';
import { normalizeColorToHex } from '../src/utils/colorNormalizer';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
// Ensure credentials are provided
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials. Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const CSV_FILE_PATH = path.resolve(process.cwd(), 'datafeed_3036937.csv.gz');
const BATCH_SIZE = 1000;

const processFeed = async () => {
  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`❌ Local file not found at ${CSV_FILE_PATH}`);
    process.exit(1);
  }

  console.log('🔄 Starting data sync...');
  let batch: any[] = [];
  let totalProcessed = 0;
  let totalInserted = 0;

  const insertBatch = async (data: any[]) => {
    if (data.length === 0) return;
    const { error } = await supabase
      .from('products')
      .upsert(data, { onConflict: 'product_id' }); // Use upsert to avoid duplicate key errors
    
    if (error) {
      console.error('❌ Error inserting batch:', error.message);
    } else {
      totalInserted += data.length;
      console.log(`✅ Inserted ${totalInserted} products so far...`);
    }
  };

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(zlib.createGunzip())
      .pipe(csv())
      .on('data', async (row) => {
        // Dynamically support both Awin Standard and Google Feed format column names
        const productId = row['id'] || row['aw_product_id'] || row['Product ID'];
        const name = row['title'] || row['product_name'] || row['Product Name'];
        const price = row['price'] || row['search_price'] || row['Search Price'];
        const imageUrl = row['image_link'] || row['merchant_image_url'] || row['aw_image_url'];
        const affiliateUrl = row['aw_deep_link'] || row['deeplink'] || row['merchant_deep_link'];
        let rawColor = row['color'] || row['colour'] || row['Color'] || '';

        // Skip if essential data is missing
        if (!productId || !name || !imageUrl || !affiliateUrl) return;

        // Fallback to extracting color from the product title if the dedicated column is empty
        if (!rawColor.trim()) {
          rawColor = name;
        }

        const hex_code = normalizeColorToHex(rawColor);

        // If the normalizer returns the fallback gray (#808080) and the word "gray" or "grey" wasn't actually in the string, skip it
        const lowerRaw = rawColor.toLowerCase();
        if (hex_code === '#808080' && !lowerRaw.includes('gray') && !lowerRaw.includes('grey')) {
          // No recognizable color found, discard it
          return;
        }

        batch.push({
          product_id: productId.toString(),
          name: name.toString(),
          price: price ? price.toString() : null,
          image_url: imageUrl.toString(),
          affiliate_url: affiliateUrl.toString(),
          hex_code: hex_code
        });

        totalProcessed++;

        if (batch.length >= BATCH_SIZE) {
          const currentBatch = [...batch];
          batch = [];
          insertBatch(currentBatch); // asynchronous insert without blocking the stream (fire and forget for speed)
        }
      })
      .on('end', async () => {
        // Insert any remaining items
        if (batch.length > 0) {
          await insertBatch(batch);
        }
        
        console.log(`🎉 Sync Complete! Processed ${totalProcessed} total valid rows.`);
        resolve(null);
      })
      .on('error', (err) => {
        console.error('❌ Error reading CSV:', err);
        reject(err);
      });
  });
};

processFeed().catch((err) => {
  console.error('Fatal error during sync:', err);
  process.exit(1);
});
