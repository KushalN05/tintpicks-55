import { catalogueProducts } from '../src/data/catalogue';
import { computeProductVector } from '../src/services/searchEngine';
import * as fs from 'fs';
import * as path from 'path';

// Generate precomputed embeddings for the entire catalogue
export function generateCatalogueEmbeddings() {
  const indexData = catalogueProducts.map(product => {
    const vector = computeProductVector(product);
    return {
      id: product.id,
      title: product.title,
      brand: product.brand,
      category: product.category,
      price: product.price,
      currency: product.currency,
      image_url: product.image_url,
      merchant: product.merchant,
      product_url: product.product_url,
      colour: product.colour,
      pattern: product.pattern,
      attributes: product.attributes,
      match_reasons: product.match_reasons,
      embedding: vector,
    };
  });

  const outPath = path.resolve(__dirname, 'catalogueEmbeddings.json');
  fs.writeFileSync(outPath, JSON.stringify(indexData, null, 2), 'utf-8');
  console.log(`Successfully indexed ${indexData.length} catalogue products with visual embeddings.`);
}

if (require.main === module) {
  generateCatalogueEmbeddings();
}
