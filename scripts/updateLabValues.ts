import { createClient } from '@supabase/supabase-js';
import convert from 'color-convert';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// Need service role key to bypass RLS for mass updates, but we'll try anon if service key isn't available
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase Environment Variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateLabValues() {
  console.log('Starting LAB values backfill...');

  let processed = 0;
  let hasMore = true;
  const BATCH_SIZE = 1000;

  while (hasMore) {
    // Fetch products that have a hex code but no LAB values
    const { data: products, error } = await supabase
      .from('products')
      .select('product_id, hex_code')
      .not('hex_code', 'is', null)
      .is('l_val', null)
      .limit(BATCH_SIZE);

    if (error) {
      console.error('Error fetching products:', error);
      break;
    }

    if (!products || products.length === 0) {
      hasMore = false;
      break;
    }

    console.log(`Processing batch of ${products.length} products...`);

    // Prepare updates
    const updates = products.map((product) => {
      try {
        const cleanHex = product.hex_code.replace('#', '');
        const [l, a, b] = convert.hex.lab(cleanHex);
        return {
          product_id: product.product_id,
          l_val: l,
          a_val: a,
          b_val: b
        };
      } catch (err) {
        console.warn(`Failed to convert hex ${product.hex_code} for product ${product.product_id}`);
        return null;
      }
    }).filter(Boolean);

    // Update in chunks using upsert
    if (updates.length > 0) {
      const { error: updateError } = await supabase
        .from('products')
        .upsert(updates as any, { onConflict: 'product_id' });

      if (updateError) {
        console.error('Error updating products:', updateError);
        break;
      }
    }

    processed += products.length;
    console.log(`Successfully updated ${processed} products so far.`);
  }

  console.log(`Finished LAB backfill. Total products updated: ${processed}`);
}

updateLabValues().catch(console.error);
