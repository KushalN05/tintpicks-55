export type GarmentCategory =
  | 'Jackets'
  | 'Knitwear'
  | 'Tops'
  | 'Trousers'
  | 'Dresses'
  | 'Shoes'
  | 'Other';

export type GarmentColour =
  | 'Black'
  | 'White and cream'
  | 'Brown'
  | 'Blue'
  | 'Green'
  | 'Red and pink'
  | 'Grey'
  | 'Multicolour';

export interface GarmentAttributes {
  silhouette?: string;
  closure?: string;
  collar?: string;
  sleeve_length?: string;
  fabric?: string;
  hardware?: string;
  length?: string;
  pockets?: string;
  wash?: string;
}

export interface CatalogueProduct {
  id: string;
  title: string;
  brand: string;
  category: GarmentCategory;
  image_url: string;
  fallback_image_url?: string;
  price: number;
  currency: 'GBP' | 'USD' | 'EUR';
  merchant: string;
  product_url: string;
  colour: GarmentColour;
  pattern: string;
  attributes: GarmentAttributes;
  embedding?: number[];
  isExactSampleMatchFor?: 'jacket' | 'cardigan' | 'rugby' | 'jeans';
  match_reasons?: string[];
  createdAt?: string;
}

export interface CropRegion {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface SearchQuery {
  imageUrl: string;
  fileName?: string;
  crop?: CropRegion;
  selectedCategory?: GarmentCategory | 'All';
  scenarioId?: 'jacket' | 'cardigan' | 'rugby' | 'jeans' | 'custom';
}

export type MatchTier =
  | 'Exact item'
  | 'Near-identical'
  | 'Very close match'
  | 'Similar style'
  | 'Broader alternative';

export interface AttributeComparison {
  feature: string;
  queryValue: string;
  productValue: string;
  isMatch: boolean;
  significance: 'high' | 'medium' | 'low';
}

export interface SearchResult {
  product: CatalogueProduct;
  rawSimilarity: number; // e.g. 0.985
  calibratedScore: number; // e.g. 98.5
  tier: MatchTier;
  visualMatchReasons: string[];
  attributeComparisons: AttributeComparison[];
}

export interface FilterOptions {
  similarityTier: 'all' | '95' | '90' | '80';
  category: 'all' | GarmentCategory;
  colour: 'all' | GarmentColour;
  pricePreset: 'all' | 'under25' | 'under50' | 'under100' | 'under200';
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'similarity' | 'price-asc' | 'price-desc' | 'newest';
}

export type SearchMode = 'demo' | 'vector';

export interface SampleGarment {
  id: 'jacket' | 'cardigan' | 'rugby' | 'jeans';
  name: string;
  tag: string;
  description: string;
  imageUrl: string;
  category: GarmentCategory;
  attributes: GarmentAttributes;
  scenario: string;
}
