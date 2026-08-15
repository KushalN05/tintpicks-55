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
 * Blacklisted junk keywords that signal low-quality, obscure, or off-brand products.
 * Since we have no merchant_name column, we filter on product title substrings.
 */
const JUNK_KEYWORDS = [
  'viaduct', 'costume', 'cosplay', 'halloween', 'fancy dress',
  'cheap', 'wholesale', 'bulk', 'lot of', 'pack of',
  'replica', 'knockoff', 'imitation'
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
    
    // 1. Identify the broad retail color family (e.g. "pink")
    const names = colorNamer(strictHex);
    const basicColor = names.basic[0].name.toLowerCase();
    
    // 2. Expand it to retail synonyms (e.g. "pink | rose | blush")
    const colorSearchTerm = getRetailColorSynonyms(basicColor);

    // 3. Base Query
    let query = supabaseProducts
      .from('products')
      .select('product_id, name, price, image_url, affiliate_url, hex_code')
      .not('image_url', 'is', null)
      .not('affiliate_url', 'is', null);

    // 4. Force Title-Based Color Search! (The Magic Bullet)
    query = query.textSearch('name', colorSearchTerm);

    // 5. Apply NSFW + Junk Brand Blacklists
    [...NSFW_BLACKLIST, ...JUNK_KEYWORDS].forEach(keyword => {
      query = query.not('name', 'ilike', `%${keyword}%`);
    });

    // 6. Enterprise Gender Match using textSearch
    if (gender !== 'All' && GENDER_TERMS[gender]) {
      query = query.textSearch('name', GENDER_TERMS[gender]);
    }

    // 7. Enterprise Category Match using textSearch
    if (category !== 'All' && CATEGORY_TERMS[category]) {
      query = query.textSearch('name', CATEGORY_TERMS[category]);
    }

    // 8. Execute and return limit
    const { data, error } = await query.limit(limit);

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    // Randomize results to keep UI fresh
    return (data || []).sort(() => Math.random() - 0.5) as Product[];

  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
