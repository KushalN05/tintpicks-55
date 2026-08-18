import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ALLOWLIST = [
  'asos.com', 'zara.com', 'hm.com', 'next.co.uk', 'marksandspencer.com', 'uniqlo.com', 'mango.com', 
  'boohoo.com', 'riverisland.com', 'primark.com', 'newlook.com', 'jdsports.co.uk', 'urbanoutfitters.com', 
  'johnlewis.com', 'selfridges.com', 'flannels.com', 'houseoffraser.co.uk', 'matalan.co.uk', 'george.com', 
  'tuclothing.sainsburys.co.uk', 'very.co.uk', 'schuh.co.uk', 'office.co.uk', 'pullandbear.com', 
  'bershka.com', 'stradivarius.com', 'massimodutti.com', 'cos.com', 'arketofficial.com', 'weekday.com', 
  'monki.com', 'stories.com', 'reiss.com', 'phase-eight.com', 'hobbs.com', 'whistles.com', 
  'sweatybetty.com', 'gymshark.com', 'fatface.com', 'whitestuff.com', 'joules.com', 'bensherman.co.uk', 
  'fredperry.com', 'frenchconnection.com', 'superdry.com', 'allsaints.com', 'hollisterco.com', 
  'abercrombie.com', 'levis.com', 'vans.co.uk', 'timberland.co.uk'
];
const BLOCKLIST_DOMAINS = ['shein', 'temu', 'aliexpress', 'wish', 'dhgate', 'cider', 'lightinthebox'];
const BLOCKLIST_TERMS = ['cushion', 'pillow', 'towel', 'curtain', 'paint', 'fabric', 'rug', 'home', 'kids', 'baby'];
const COLOR_FAMILIES = ['black', 'white', 'grey', 'gray', 'navy', 'blue', 'green', 'olive', 'brown', 'beige', 'cream', 'red', 'burgundy', 'pink', 'yellow', 'mustard', 'orange', 'purple', 'plum', 'teal', 'khaki', 'lilac'];

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

    const { hexCode, colorName = 'Color', gender = 'All', category = 'All', limit = 24 } = await req.json()

    if (!hexCode) {
      return new Response(JSON.stringify({ error: 'hexCode is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Construct Google Shopping text query
    const genderTerm = gender !== 'All' ? (gender === 'Mens' ? 'Mens' : gender === 'Womens' ? 'Womens' : gender) : '';
    const categoryTerm = category !== 'All' ? category : 'Clothing';
    const textQuery = `${genderTerm} "${colorName}" ${categoryTerm}`.trim().replace(/\s+/g, ' ');

    // Fetch from SerpApi Google Shopping engine
    const searchParams = new URLSearchParams({
      engine: 'google_shopping',
      q: textQuery,
      api_key: SERPAPI_KEY,
      gl: 'uk', // Geolocation
      hl: 'en'  // Language
    });

    const serpapiRes = await fetch(`https://serpapi.com/search.json?${searchParams.toString()}`);
    
    if (!serpapiRes.ok) {
      const errText = await serpapiRes.text();
      console.error('SerpApi Error:', errText);
      throw new Error(`SerpApi responded with status: ${serpapiRes.status}`);
    }

    const serpapiData = await serpapiRes.json();
    const shoppingMatches = serpapiData.shopping_results || [];

    // The Progressive Relaxation Filter
    let results: any[] = [];
    const categorySynonyms = CATEGORY_SYNONYMS[category] || [];

    // Google Shopping usually provides 'link' and sometimes 'source'
    const targetColorWords = colorName.toLowerCase().split(' ');
    const conflictingColors = COLOR_FAMILIES.filter(c => !targetColorWords.includes(c));

    const isDomainAllowed = (link: string, source?: string) => {
      const linkLower = link ? link.toLowerCase() : '';
      const sourceLower = source ? source.toLowerCase() : '';
      
      // Explicitly block dropshippers
      if (BLOCKLIST_DOMAINS.some(domain => linkLower.includes(domain) || sourceLower.includes(domain))) {
        return false;
      }

      return ALLOWLIST.some(domain => 
        linkLower.includes(domain) || 
        sourceLower.includes(domain.replace('.com', '').replace('.co.uk', ''))
      );
    };
      
    const isTitleBlocked = (title: string) => {
      const lowerTitle = title.toLowerCase();
      if (BLOCKLIST_TERMS.some(blocked => lowerTitle.includes(blocked))) return true;
      // Drop results that contain conflicting colors in the title
      if (conflictingColors.some(color => lowerTitle.includes(` ${color}`) || lowerTitle.startsWith(`${color} `))) return true;
      return false;
    };
    
    const hasCategorySynonym = (title: string) => categorySynonyms.length === 0 || categorySynonyms.some(synonym => title.toLowerCase().includes(synonym));
    // For Google Shopping, price is usually just a string 'price' or a float 'extracted_price'
    const hasPrice = (match: any) => match.price || match.extracted_price !== undefined;

    // Map to normalized Product format used by frontend
    const mapToProduct = (match: any) => ({
      product_id: match.position?.toString() || Math.random().toString(36).substring(7),
      name: match.title || 'Fashion Item',
      price: match.price || (match.extracted_price ? `$${match.extracted_price}` : ''),
      image_url: match.thumbnail,
      link: match.link || match.product_link,
      hex_code: hexCode
    });

    // Pass 1: Strict Mode (Price, Allowlist, No Blocklist, Category Synonym)
    const pass1 = shoppingMatches.filter((match: any) => 
      hasPrice(match) && 
      isDomainAllowed(match.link || '', match.source || '') && 
      !isTitleBlocked(match.title || '') &&
      hasCategorySynonym(match.title || '')
    );

    if (pass1.length > 0) {
      console.log(`Pass 1 successful. Found ${pass1.length} matches.`);
      results = pass1;
    } else {
      // Pass 2: Loosen Category (Price, Allowlist, No Blocklist)
      const pass2 = shoppingMatches.filter((match: any) => 
        hasPrice(match) && 
        isDomainAllowed(match.link || '', match.source || '') && 
        !isTitleBlocked(match.title || '')
      );
      
      if (pass2.length > 0) {
        console.log(`Pass 2 successful. Found ${pass2.length} matches.`);
        results = pass2;
      } else {
        // Pass 3: Expand Domain Net (Price, No Blocklist)
        const pass3 = shoppingMatches.filter((match: any) => 
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
