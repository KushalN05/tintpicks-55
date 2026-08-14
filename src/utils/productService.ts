import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).');
}

export const supabaseProducts = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Product {
  product_id: string;
  name: string;
  price: string | null;
  image_url: string | null;
  affiliate_url: string | null;
  hex_code: string | null;
}

/**
 * Converts a hex color to RGB components.
 */
const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

/**
 * Computes Euclidean distance between two RGB colors.
 */
const colorDistance = (hex1: string, hex2: string): number => {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
};

/**
 * Fetches products from Supabase that closely match a given hex color.
 * 
 * Strategy: We pull a larger batch of products, then sort client-side 
 * by RGB distance to find the closest visual matches. This is necessary
 * because Supabase doesn't support native color-distance queries.
 */
export const fetchProductsByColor = async (
  hexCode: string,
  limit: number = 24
): Promise<Product[]> => {
  // Fetch a large pool of products that have valid images and affiliate links
  const { data, error } = await supabaseProducts
    .from('products')
    .select('product_id, name, price, image_url, affiliate_url, hex_code')
    .not('image_url', 'is', null)
    .not('affiliate_url', 'is', null)
    .not('hex_code', 'is', null)
    .limit(2000);

  if (error) {
    console.error('Error fetching products:', error.message);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Sort by color distance (closest match first)
  const sorted = data
    .filter((p) => p.hex_code && p.hex_code.startsWith('#'))
    .sort((a, b) => {
      const distA = colorDistance(hexCode, a.hex_code!);
      const distB = colorDistance(hexCode, b.hex_code!);
      return distA - distB;
    });

  return sorted.slice(0, limit);
};
