import fs from 'fs';
import path from 'path';
import https from 'https';
import csv from 'csv-parser';
import zlib from 'zlib';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const AWIN_FEED_URL = process.env.AWIN_FEED_URL;

if (!AWIN_FEED_URL) {
  console.error('❌ Missing AWIN_FEED_URL. Set it in .env or .env.local.');
  process.exit(1);
}

const uniqueColors = new Set<string>();

const processFeed = async () => {
  console.log(`⬇️ Initiating stream from Awin feed: ${AWIN_FEED_URL}...`);
  console.log('🔄 Profiling colors, this may take a moment for massive feeds...');

  return new Promise((resolve, reject) => {
    https.get(AWIN_FEED_URL, (response) => {
      // Handle redirects if present
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.error('Redirect detected, please update your AWIN_FEED_URL to the final destination.');
        reject(new Error('Redirect detected'));
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get response: ${response.statusCode}`));
        return;
      }

      response
        .pipe(zlib.createGunzip())
        .pipe(csv())
        .on('data', (row) => {
          // Extract the color field based on the Awin exact schema
          const rawColor = row['color'];
          
          if (rawColor) {
            // Clean trailing/leading whitespace and convert to lowercase
            const cleanedColor = rawColor.trim().toLowerCase();
            if (cleanedColor) {
              uniqueColors.add(cleanedColor);
            }
          }
        })
        .on('end', () => {
          console.log(`✅ Stream complete. Found ${uniqueColors.size} unique color strings.`);
          
          // Convert Set to Array, sort alphabetically
          const sortedColors = Array.from(uniqueColors).sort();
          
          // Write to local JSON file
          const outputPath = path.resolve(process.cwd(), 'unique_colors.json');
          fs.writeFileSync(outputPath, JSON.stringify(sortedColors, null, 2));
          
          console.log(`💾 Saved unique colors dictionary to ${outputPath}`);
          resolve(null);
        })
        .on('error', (err) => {
          console.error('❌ Error processing feed stream:', err);
          reject(err);
        });
    }).on('error', (err) => {
      console.error('❌ Error requesting feed:', err);
      reject(err);
    });
  });
};

processFeed().catch((err) => {
  console.error('Fatal error during profiling:', err);
  process.exit(1);
});
