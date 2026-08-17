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
 * Strict whitelist of reputable brands to curate the fashion feed.
 * Since there is no merchant_name column, we use textSearch on the product title.
 */
const TRUSTED_BRANDS = [
  'ASOS', 'Nike', 'Adidas', 'Mango', 'Zara', 'Topshop', 'H&M', 
  'Boohoo', 'PrettyLittleThing', 'New Balance', 'Puma', 'Vans', 'Converse'
];

/**
 * Maps a generic basic color to its common retail synonyms to maximize search hits.
 */
const getRetailColorSynonyms = (basicColor: string): string => {
  const colorMap: Record<string, string> = {
    'red': 'red | crimson | ruby | scarlet | burgundy | maroon | wine',
    'pink': 'pink | rose | fuschia | magenta | blush | coral | salmon',
    'orange': 'orange | peach | apricot | tangerine | rust',
    'yellow': 'yellow | mustard | gold | lemon',
    'green': 'green | olive | emerald | mint | sage | khaki | lime',
    'blue': 'blue | navy | azure | denim | indigo | cobalt | cyan | teal | turquoise',
    'purple': 'purple | lilac | lavender | violet | plum | magenta',
    'brown': 'brown | tan | beige | camel | chocolate | coffee | taupe | khaki',
    'white': 'white | cream | ivory | bone | off-white',
    'gray': 'gray | grey | charcoal | silver | slate | ash',
    'black': 'black | charcoal | obsidian | midnight',
  };

  return colorMap[basicColor] || basicColor;
};

/**
 * Fetches products from Supabase using pure Title-Based searching.
 * Guarantees that items strictly match the selected color family, gender, and category.
 */
export const fetchProductsByColor = async (
  hexCode: string,
  gender: string = 'All',
  category: string = 'All',
  limit: number = 30
): Promise<Product[]> => {
  try {
    const strictHex = hexCode.startsWith('#') ? hexCode : `#${hexCode}`;
    
    // 1. Convert hex to LAB
    const { hexToLab } = await import('./colorConverter');
    const lab = hexToLab(strictHex);
    
    if (!lab) {
      console.warn('Invalid hex provided to fetchProductsByColor:', hexCode);
      return [];
    }

    // 2. Call the RPC function to find the closest Delta E matches
    const { data, error } = await supabaseProducts.rpc('match_products_by_color', {
      target_l: lab.l,
      target_a: lab.a,
      target_b: lab.b,
      p_gender: gender,
      p_category: category,
      p_limit: limit
    });

    if (error) {
      console.error('Supabase fetch error via RPC:', error);
      return [];
    }

    return (data || []) as Product[];

  } catch (error) {
    console.error('Error fetching products by color:', error);
    return [];
  }
};
