import { createClient } from '@supabase/supabase-js';
import colorNamer from 'color-namer';

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
 * Maps gender filter labels to PostgreSQL textSearch strings.
 * We use textSearch to avoid substring mismatches (e.g. "her" matching "Thermal").
 */
const GENDER_TERMS: Record<string, string> = {
  'Mens': "men | mens | male | him | boy",
  'Womens': "women | womens | ladies | female | her | girl",
  'Unisex': "unisex",
};

/**
 * Maps category filter labels to PostgreSQL textSearch strings.
 */
const CATEGORY_TERMS: Record<string, string> = {
  'Shirts': "shirt | blouse | top | tee | t-shirt",
  'Trousers': "trouser | pant | chino | jean | denim",
  'Jackets': "jacket | coat | blazer | parka | bomber",
  'Dresses': "dress | gown | maxi | mini",
  'Shoes': "shoe | trainer | sneaker | boot | sandal | heel",
  'Shorts': "short | shorts",
  'Skirts': "skirt | skirts",
  'Hoodies': "hoodie | sweatshirt | pullover | sweater",
  'Bags': "bag | tote | backpack | clutch | handbag",
  'Accessories': "hat | scarf | belt | watch | sunglasses | jewellery | jewelry",
};

const NSFW_BLACKLIST = [
  'lingerie', 'underwear', 'bra', 'briefs', 'panties', 
  'swim', 'bikini', 'thong', 'boxers'
];

/**
 * Fetches products from Supabase using the exact color_name.
 * Applies strict taxonomy filtering and NSFW blacklist.
 */
export const fetchProductsByColor = async (
  hexCode: string,
  gender: string = 'All',
  category: string = 'All',
  limit: number = 30
): Promise<Product[]> => {
  try {
    // 1. Generate strictly formatted hex and extract HTML color name
    const strictHex = hexCode.startsWith('#') ? hexCode : `#${hexCode}`;
    const names = colorNamer(strictHex);
    const searchableColor = names.html[0].name.toLowerCase();

    // 2. Base Query
    let query = supabaseProducts
      .from('products')
      .select('product_id, name, price, image_url, affiliate_url, hex_code')
      .not('image_url', 'is', null)
      .not('affiliate_url', 'is', null)
      .ilike('color_name', `%${searchableColor}%`);

    // 3. Apply NSFW Blacklist
    NSFW_BLACKLIST.forEach(keyword => {
      query = query.not('name', 'ilike', `%${keyword}%`);
    });

    // 4. Enterprise Gender Match using textSearch
    if (gender !== 'All' && GENDER_TERMS[gender]) {
      query = query.textSearch('name', GENDER_TERMS[gender]);
    }

    // 5. Enterprise Category Match using textSearch
    if (category !== 'All' && CATEGORY_TERMS[category]) {
      query = query.textSearch('name', CATEGORY_TERMS[category]);
    }

    // 6. Limit Results
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

