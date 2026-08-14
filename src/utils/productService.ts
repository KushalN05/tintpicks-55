import { createClient } from '@supabase/supabase-js';
import { getRetailColorFamily } from './retailColorMapper';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase Environment Variables in Vite Build");
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
 * Fetches products from Supabase using the Fashion Color Mapper.
 * Maps the exact hex to a retail keyword, then searches Supabase natively.
 */
export const fetchProductsByColor = async (
  hexCode: string,
  gender: string = 'All',
  category: string = 'All',
  limit: number = 30
): Promise<Product[]> => {
  try {
    const retailKeyword = getRetailColorFamily(hexCode);

    let query = supabaseProducts
      .from('products')
      .select('product_id, name, price, image_url, affiliate_url, hex_code')
      .not('image_url', 'is', null)
      .not('affiliate_url', 'is', null)
      .ilike('name', `%${retailKeyword}%`);

    if (gender !== 'All') {
      // Map standard terms if necessary or just directly use ilike
      query = query.ilike('name', `%${gender}%`);
    }

    if (category !== 'All') {
      query = query.ilike('name', `%${category}%`);
    }

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('Error fetching products:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Fatal error processing products:', error);
    return [];
  }
};
