import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import colorNamer from 'color-namer';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials. Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BATCH_SIZE = 1000;
const DELAY_MS = 500;

/**
 * Pauses execution for the given number of milliseconds.
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Gets the closest standard HTML color name for a given hex code.
 */
const getColorName = (hex: string): string => {
  try {
    const result = colorNamer(hex);
    // Use the HTML color names list for standardized naming
    return result.html[0]?.name || 'Unknown';
  } catch {
    return 'Unknown';
  }
};

const updateColorNames = async () => {
  console.log('🔄 Starting color name migration...');
  let totalUpdated = 0;
  let batchNumber = 0;

  while (true) {
    batchNumber++;
    const offset = (batchNumber - 1) * BATCH_SIZE;

    // Fetch a batch of rows where color_name is null
    const { data: rows, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .is('color_name', null)
      .not('hex_code', 'is', null)
      .limit(BATCH_SIZE);

    if (fetchError) {
      console.error(`❌ Fetch error on batch ${batchNumber}:`, fetchError.message);
      break;
    }

    if (!rows || rows.length === 0) {
      console.log('✅ No more rows to process. Migration complete!');
      break;
    }

    console.log(`📦 Processing batch ${batchNumber} (${rows.length} rows)...`);

    // Map each row to an update payload containing all existing columns
    const updates = rows.map(row => ({
      ...row,
      color_name: getColorName(row.hex_code),
    }));

    // Upsert the batch back to Supabase
    const { error: upsertError } = await supabase
      .from('products')
      .upsert(updates, { onConflict: 'product_id' });

    if (upsertError) {
      console.error(`❌ Upsert error on batch ${batchNumber}:`, upsertError.message);
    } else {
      totalUpdated += rows.length;
      console.log(`✅ Updated batch ${batchNumber} — ${totalUpdated} total rows updated so far.`);
    }

    // If this batch was smaller than BATCH_SIZE, we've reached the end
    if (rows.length < BATCH_SIZE) {
      console.log('✅ Final batch processed. Migration complete!');
      break;
    }

    // Delay between batches to respect connection limits
    await sleep(DELAY_MS);
  }

  console.log(`🎉 Migration finished! Total rows updated: ${totalUpdated}`);
};

updateColorNames().catch((err) => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
