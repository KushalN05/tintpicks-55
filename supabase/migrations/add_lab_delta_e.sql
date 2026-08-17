-- 1. Add LAB columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS l_val FLOAT,
ADD COLUMN IF NOT EXISTS a_val FLOAT,
ADD COLUMN IF NOT EXISTS b_val FLOAT;

-- 2. Create or replace the match_products_by_color function
CREATE OR REPLACE FUNCTION match_products_by_color(
  target_l FLOAT,
  target_a FLOAT,
  target_b FLOAT,
  p_gender TEXT,
  p_category TEXT,
  p_limit INT DEFAULT 30
)
RETURNS TABLE (
  product_id TEXT,
  name TEXT,
  price TEXT,
  image_url TEXT,
  affiliate_url TEXT,
  hex_code TEXT,
  l_val FLOAT,
  a_val FLOAT,
  b_val FLOAT,
  delta_e FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.product_id, 
    p.name, 
    p.price, 
    p.image_url, 
    p.affiliate_url, 
    p.hex_code,
    p.l_val,
    p.a_val,
    p.b_val,
    -- Calculate Euclidean distance (Delta E CIE76)
    SQRT(
      POW(p.l_val - target_l, 2) + 
      POW(p.a_val - target_a, 2) + 
      POW(p.b_val - target_b, 2)
    ) AS delta_e
  FROM products p
  WHERE 
    p.hex_code IS NOT NULL
    AND p.l_val IS NOT NULL
    AND (p_gender = 'All' OR p.name ILIKE '%' || (
      CASE 
        WHEN p_gender = 'Mens' THEN 'men'
        WHEN p_gender = 'Womens' THEN 'women'
        ELSE p_gender
      END
    ) || '%')
    AND (p_category = 'All' OR p.name ILIKE '%' || (
      CASE 
        WHEN p_category = 'Shirts' THEN 'shirt'
        WHEN p_category = 'Trousers' THEN 'trouser'
        WHEN p_category = 'Jackets' THEN 'jacket'
        WHEN p_category = 'Dresses' THEN 'dress'
        WHEN p_category = 'Shoes' THEN 'shoe'
        WHEN p_category = 'Shorts' THEN 'short'
        WHEN p_category = 'Skirts' THEN 'skirt'
        WHEN p_category = 'Hoodies' THEN 'hoodie'
        WHEN p_category = 'Bags' THEN 'bag'
        ELSE p_category
      END
    ) || '%')
  ORDER BY delta_e ASC
  LIMIT p_limit;
END;
$$;
