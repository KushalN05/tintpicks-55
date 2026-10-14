import fs from 'fs';
import path from 'path';
import { catalogueProducts } from '../src/data/catalogue';
import { computeProductVector, cosineSimilarity } from '../src/services/searchEngine';
import { generateGeminiEmbedding, extractVisualFeatureVector } from './geminiService';
import { CatalogueProduct } from '../src/types/threadfind';

export interface SearchApiRequest {
  image: string; // Base64 data URL, raw base64, or local/remote image URL
  mimeType?: string;
  category?: string;
  maxPrice?: number;
  mode?: 'auto' | 'gemini' | 'demo';
}

export interface SearchApiResponseItem {
  product: CatalogueProduct;
  similarity: number;
  matchScore: number;
  label: 'Best visual match' | 'Close match' | 'Similar style' | 'Broader alternative';
  matchReasons: string[];
}

export interface SearchApiResponse {
  success: boolean;
  query: {
    itemCount: number;
    embeddingModel: string;
    source: string;
    hasApiKey: boolean;
  };
  results: SearchApiResponseItem[];
  error?: string;
}

// In-memory cache of precomputed catalogue vectors
interface CachedProduct {
  product: CatalogueProduct;
  vector: number[];
}

let cachedCatalogue: CachedProduct[] | null = null;

function getCachedCatalogue(): CachedProduct[] {
  if (!cachedCatalogue) {
    cachedCatalogue = catalogueProducts.map(p => {
      // 1. If precomputed embedding exists on product record
      if (p.embedding && p.embedding.length > 0) {
        return { product: p, vector: p.embedding };
      }

      // 2. If local catalogue image exists, extract actual visual feature vector from image bytes
      if (p.image_url && p.image_url.startsWith('/')) {
        try {
          const localPath = path.join(process.cwd(), 'public', p.image_url.replace(/^\//, ''));
          if (fs.existsSync(localPath)) {
            const buf = fs.readFileSync(localPath);
            const visualVec = extractVisualFeatureVector(buf);
            return { product: p, vector: visualVec };
          }
        } catch (e) {
          console.warn('Could not read image for product vector:', p.id, e);
        }
      }

      // 3. Fallback to structured feature vector computation expanded to 32 dimensions
      const baseVec = computeProductVector(p);
      const fullVec = new Array(32).fill(0);
      for (let i = 0; i < baseVec.length; i++) fullVec[i] = baseVec[i];
      for (let j = baseVec.length; j < 32; j++) fullVec[j] = baseVec[j % baseVec.length] * 0.35;
      const mag = Math.sqrt(fullVec.reduce((s, v) => s + v * v, 0)) || 1;
      return { product: p, vector: fullVec.map(v => v / mag) };
    });
  }
  return cachedCatalogue;
}

export function mapSimilarityToLabel(
  sim: number
): 'Best visual match' | 'Close match' | 'Similar style' | 'Broader alternative' {
  if (sim >= 0.90) return 'Best visual match';
  if (sim >= 0.82) return 'Close match';
  if (sim >= 0.72) return 'Similar style';
  return 'Broader alternative';
}

/**
 * Core Search Handler: processes image, computes vector similarity against catalogue, and returns top 10 matches
 */
export async function handleSearch(
  requestBody: SearchApiRequest
): Promise<SearchApiResponse> {
  const { image, mimeType = 'image/jpeg', category, maxPrice } = requestBody;

  if (!image || typeof image !== 'string' || image.length < 5) {
    return {
      success: false,
      query: { itemCount: 0, embeddingModel: 'none', source: 'none', hasApiKey: !!process.env.GEMINI_API_KEY },
      results: [],
      error: 'Invalid or missing image payload. Please provide a valid JPEG, PNG, or WebP image.',
    };
  }

  // 1. Generate query embedding from actual image
  const embeddingResult = await generateGeminiEmbedding(image, mimeType);
  const queryVector = embeddingResult.embedding;

  // 2. Load precomputed catalogue embeddings
  const catalogue = getCachedCatalogue();

  // 3. Compute cosine similarity for each product
  let scoredItems = catalogue.map(({ product, vector }) => {
    // If embedding dimensions differ, match on common length
    const minLen = Math.min(queryVector.length, vector.length);
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < minLen; i++) {
      dot += queryVector[i] * vector[i];
      normA += queryVector[i] * queryVector[i];
      normB += vector[i] * vector[i];
    }

    const sim = (normA > 0 && normB > 0) ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
    // Normalized into [0, 1]
    const clampedSim = Math.max(0, Math.min(1, sim));

    // Dynamic calibrated score
    const matchScore = Number((clampedSim * 100).toFixed(1));
    const label = mapSimilarityToLabel(clampedSim);

    const reasons = product.match_reasons || [
      `Matching ${product.colour.toLowerCase()} colour distribution`,
      `Similar ${product.category.toLowerCase()} silhouette profile`,
    ];

    return {
      product,
      similarity: Number(clampedSim.toFixed(4)),
      matchScore,
      label,
      matchReasons: reasons,
    };
  });

  // Optional category filter
  if (category && category !== 'All' && category !== 'all') {
    scoredItems = scoredItems.filter(item => item.product.category.toLowerCase() === category.toLowerCase());
  }

  // Optional maxPrice filter
  if (maxPrice && maxPrice > 0) {
    scoredItems = scoredItems.filter(item => item.product.price <= maxPrice);
  }

  // 4. Rank descending by similarity
  scoredItems.sort((a, b) => b.similarity - a.similarity);

  // 5. Return top 10 available matches
  const top10 = scoredItems.slice(0, 10);

  return {
    success: true,
    query: {
      itemCount: top10.length,
      embeddingModel: embeddingResult.model,
      source: embeddingResult.source,
      hasApiKey: !!process.env.GEMINI_API_KEY,
    },
    results: top10,
    error: embeddingResult.error,
  };
}
