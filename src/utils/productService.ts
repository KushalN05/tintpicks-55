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

// Helper to calculate precise Euclidean distance between two hex codes
const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
};

const getColorDistance = (hex1: string, hex2: string) => {
  if (!hex1 || !hex2) return 999999;
  try {
    const c1 = hexToRgb(hex1);
    const c2 = hexToRgb(hex2);
    return Math.sqrt(
      Math.pow(c1.r - c2.r, 2) + 
      Math.pow(c1.g - c2.g, 2) + 
      Math.pow(c1.b - c2.b, 2)
    );
  } catch {
    return 999999;
  }
};

/**
 * Fetches products from Supabase using exact Euclidean color distance.
 * Applies strict taxonomy filtering and NSFW blacklist.
 */
export const fetchProductsByColor = async (
  hexCode: string,
  gender: string = 'All',
  category: string = 'All',
  limit: number = 30
): Promise<Product[]> => {
  try {
    // 1. Generate strictly formatted hex
    const strictHex = hexCode.startsWith('#') ? hexCode : `#${hexCode}`;
    
    // 2. Pre-filter by the top 5 closest HTML color buckets to cast a wide but relevant net
    const names = colorNamer(strictHex);
    const closestColorBuckets = names.html.slice(0, 5).map(c => c.name.toLowerCase());

    // 3. Base Query (Fetch up to 1000 items to mathematically sort locally)
    let query = supabaseProducts
      .from('products')
      .select('product_id, name, price, image_url, affiliate_url, hex_code')
      .not('image_url', 'is', null)
      .not('affiliate_url', 'is', null)
      .in('color_name', closestColorBuckets);

    // 4. Apply NSFW Blacklist
    NSFW_BLACKLIST.forEach(keyword => {
      query = query.not('name', 'ilike', `%${keyword}%`);
    });

    // 5. Enterprise Gender Match using textSearch
    if (gender !== 'All' && GENDER_TERMS[gender]) {
      query = query.textSearch('name', GENDER_TERMS[gender]);
    }

    // 6. Enterprise Category Match using textSearch
    if (category !== 'All' && CATEGORY_TERMS[category]) {
      query = query.textSearch('name', CATEGORY_TERMS[category]);
    }

    // 7. Fetch large pool
    const { data, error } = await query.limit(1000);

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    // 8. Mathematically sort by true Euclidean distance to captured hex
    if (data && data.length > 0) {
      const sortedData = data.sort((a, b) => {
        const distA = getColorDistance(strictHex, a.hex_code || '');
        const distB = getColorDistance(strictHex, b.hex_code || '');
        return distA - distB;
      });

      // 9. Return only the top absolute closest matches
      return sortedData.slice(0, limit) as Product[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
