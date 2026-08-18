import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALLOWLIST = ['asos.com', 'zara.com', 'hm.com', 'next.co.uk', 'marksandspencer.com', 'uniqlo.com', 'mango.com', 'shop.mango.com'];
const BLOCKLIST = ['cushion', 'pillow', 'towel', 'curtain', 'paint', 'fabric', 'rug', 'home', 'kids', 'baby'];

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  'Shirts': ['shirt', 'top', 't-shirt', 'blouse', 'polo', 'tee'],
  'Trousers': ['trouser', 'jeans', 'pants', 'chinos', 'joggers', 'cargo'],
  'Jackets': ['jacket', 'coat', 'blazer', 'parka', 'trench', 'bomber'],
  'Dresses': ['dress', 'gown', 'frock'],
  'Shoes': ['shoe', 'sneaker', 'boot', 'trainer', 'heel', 'sandal', 'loafer'],
  'Shorts': ['short', 'trunks'],
  'Skirts': ['skirt', 'mini', 'midi', 'maxi'],
  'Hoodies': ['hoodie', 'sweater', 'jumper', 'sweatshirt', 'cardigan', 'knit'],
  'Bags': ['bag', 'tote', 'backpack', 'clutch', 'purse', 'satchel'],
  'Accessories': ['hat', 'cap', 'scarf', 'belt', 'sunglasses', 'glove', 'tie', 'wallet', 'watch'],
  'All': []
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY') || 'API'; // Fallback to 'API' as requested by user
    
    if (!SERPAPI_KEY) {
      throw new Error('SERPAPI_KEY is not set')
    }

    const { hexCode, gender = 'All', category = 'All', limit = 24 } = await req.json()

    if (!hexCode) {
      return new Response(JSON.stringify({ error: 'hexCode is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const cleanHex = hexCode.replace('#', '');
    // Generate synthetic solid color block URL
    const syntheticImageUrl = `https://placehold.co/500x500/${cleanHex}/${cleanHex}.png`;
    
    // Construct Google Lens text query constraint
    const textQuery = [gender !== 'All' ? gender : '', category !== 'All' ? category : ''].filter(Boolean).join(' ').trim();

    // Fetch from SerpApi Google Lens engine
    const searchParams = new URLSearchParams({
      engine: 'google_lens',
      url: syntheticImageUrl,
      api_key: SERPAPI_KEY
    });
    
    if (textQuery) {
      searchParams.append('q', textQuery);
    }

    const serpapiRes = await fetch(`https://serpapi.com/search.json?${searchParams.toString()}`);
    
    if (!serpapiRes.ok) {
      const errText = await serpapiRes.text();
      console.error('SerpApi Error:', errText);
      throw new Error(`SerpApi responded with status: ${serpapiRes.status}`);
    }

    const serpapiData = await serpapiRes.json();
    const visualMatches = serpapiData.visual_matches || [];

    // The Progressive Relaxation Filter
    let results: any[] = [];
    const categorySynonyms = CATEGORY_SYNONYMS[category] || [];

    const isDomainAllowed = (link: string) => ALLOWLIST.some(domain => link.toLowerCase().includes(domain));
    const isTitleBlocked = (title: string) => BLOCKLIST.some(blocked => title.toLowerCase().includes(blocked));
    const hasCategorySynonym = (title: string) => categorySynonyms.length === 0 || categorySynonyms.some(synonym => title.toLowerCase().includes(synonym));
    const hasPrice = (match: any) => match.price && match.price.extracted_value !== undefined;

    // Map to normalized Product format used by frontend
    const mapToProduct = (match: any) => ({
      product_id: match.position?.toString() || Math.random().toString(36).substring(7),
      name: match.title || 'Fashion Item',
      price: match.price?.extracted_value?.toString() || match.price?.currency + match.price?.value || '',
      image_url: match.thumbnail,
      affiliate_url: match.link,
      hex_code: hexCode
    });

    // Pass 1: Strict Mode (Price, Allowlist, No Blocklist, Category Synonym)
    const pass1 = visualMatches.filter((match: any) => 
      hasPrice(match) && 
      isDomainAllowed(match.link || '') && 
      !isTitleBlocked(match.title || '') &&
      hasCategorySynonym(match.title || '')
    );

    if (pass1.length > 0) {
      console.log(`Pass 1 successful. Found ${pass1.length} matches.`);
      results = pass1;
    } else {
      // Pass 2: Loosen Category (Price, Allowlist, No Blocklist)
      const pass2 = visualMatches.filter((match: any) => 
        hasPrice(match) && 
        isDomainAllowed(match.link || '') && 
        !isTitleBlocked(match.title || '')
      );
      
      if (pass2.length > 0) {
        console.log(`Pass 2 successful. Found ${pass2.length} matches.`);
        results = pass2;
      } else {
        // Pass 3: Expand Domain Net (Price, No Blocklist)
        const pass3 = visualMatches.filter((match: any) => 
          hasPrice(match) && 
          !isTitleBlocked(match.title || '')
        );
        console.log(`Pass 3 successful. Found ${pass3.length} matches.`);
        results = pass3;
      }
    }

    // Limit and map results
    const mappedResults = results.slice(0, limit).map(mapToProduct);

    return new Response(JSON.stringify(mappedResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Edge Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
