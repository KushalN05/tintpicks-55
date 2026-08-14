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
 * Maps gender filter labels to common product-name search terms.
 */
const GENDER_TERMS: Record<string, string[]> = {
  'Mens': ['Men', "Men's", 'Mens', 'Male', 'Him'],
  'Womens': ['Women', "Women's", 'Womens', 'Ladies', 'Female', 'Her'],
  'Unisex': ['Unisex'],
};

/**
 * Maps category filter labels to common product-name search terms.
 */
const CATEGORY_TERMS: Record<string, string[]> = {
  'Shirts': ['Shirt', 'Blouse', 'Top', 'Tee', 'T-Shirt'],
  'Trousers': ['Trouser', 'Pant', 'Chino', 'Jean', 'Denim'],
  'Jackets': ['Jacket', 'Coat', 'Blazer', 'Parka', 'Bomber'],
  'Dresses': ['Dress', 'Gown', 'Maxi', 'Mini'],
  'Shoes': ['Shoe', 'Trainer', 'Sneaker', 'Boot', 'Sandal', 'Heel'],
  'Shorts': ['Short'],
  'Skirts': ['Skirt'],
  'Hoodies': ['Hoodie', 'Sweatshirt', 'Pullover', 'Sweater'],
  'Bags': ['Bag', 'Tote', 'Backpack', 'Clutch', 'Handbag'],
  'Accessories': ['Hat', 'Scarf', 'Belt', 'Watch', 'Sunglasses', 'Jewellery', 'Jewelry'],
};

/**
 * Fetches products from Supabase using the Fashion Color Mapper.
 * Searches by retail color keyword, then optionally filters by gender/category.
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

    // Apply gender filter using .or() with multiple term variants
    if (gender !== 'All' && GENDER_TERMS[gender]) {
      const genderOr = GENDER_TERMS[gender]
        .map(term => `name.ilike.%${term}%`)
        .join(',');
      query = query.or(genderOr);
    }

    // Apply category filter using .or() with multiple term variants
    if (category !== 'All' && CATEGORY_TERMS[category]) {
      const categoryOr = CATEGORY_TERMS[category]
        .map(term => `name.ilike.%${term}%`)
        .join(',');
      query = query.or(categoryOr);
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

