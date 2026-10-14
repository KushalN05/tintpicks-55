import { supabase } from '@/integrations/supabase/client';

export interface Product {
  product_id: string;
  name: string;
  price: string | null;
  image_url: string | null;
  link: string | null;
  hex_code: string | null;
}

export const fetchProductsByColor = async (
  hexCode: string,
  colorName: string,
  gender: string = 'All',
  category: string = 'All',
  limit: number = 24
): Promise<Product[]> => {
  try {
    const strictHex = hexCode.startsWith('#') ? hexCode : `#${hexCode}`;

    // Invoke the Zero-Database Visual Search Edge Function
    const { data, error } = await supabase.functions.invoke('visual-search', {
      body: { 
        hexCode: strictHex,
        colorName,
        gender, 
        category, 
        limit 
      }
    });

    if (error) {

      return [];
    }

    return (data || []) as Product[];

  } catch {
    return [];
  }
};
