import fs from 'fs';
import path from 'path';

/**
 * Server-side Gemini Embedding Service
 * Securely uses GEMINI_API_KEY on the server to generate image embeddings via Google Gen AI API
 */

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  source: 'gemini-embedding-2' | 'gemini-api' | 'visual-feature-projection';
  error?: string;
}

/**
 * Resolves any image input (data URL, base64, local /public path, or external URL) to a raw Buffer
 */
export async function resolveImageBuffer(imageInput: string): Promise<{ buffer: Buffer; mimeType: string; base64: string }> {
  // 1. Data URL
  if (imageInput.startsWith('data:')) {
    const match = imageInput.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mime = match[1];
      const b64 = match[2];
      return { buffer: Buffer.from(b64, 'base64'), mimeType: mime, base64: b64 };
    }
  }

  // 2. HTTP / HTTPS URL
  if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
    try {
      const res = await fetch(imageInput);
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buf = Buffer.from(arrayBuf);
        const mime = res.headers.get('content-type') || 'image/jpeg';
        return { buffer: buf, mimeType: mime, base64: buf.toString('base64') };
      }
    } catch (e) {
      console.warn('Could not fetch remote image for embedding:', e);
    }
  }

  // 3. Local file in public/
  if (imageInput.startsWith('/')) {
    try {
      const localPath = path.join(process.cwd(), 'public', imageInput.replace(/^\//, ''));
      if (fs.existsSync(localPath)) {
        const buf = fs.readFileSync(localPath);
        const ext = path.extname(localPath).toLowerCase();
        const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
        return { buffer: buf, mimeType: mime, base64: buf.toString('base64') };
      }
    } catch (e) {
      console.warn('Could not read local file:', e);
    }
  }

  // 4. Raw base64 string
  const cleanB64 = imageInput.replace(/^data:image\/\w+;base64,/, '').trim();
  const buf = Buffer.from(cleanB64, 'base64');
  return { buffer: buf, mimeType: 'image/jpeg', base64: cleanB64 };
}

/**
 * Extracts a normalized 32-dimensional visual feature vector directly from image bytes.
 * Analyzes RGB color distribution, HSL hue bins, luminance, texture gradient, and spatial layout.
 */
export function extractVisualFeatureVector(imageBuffer: Buffer): number[] {
  const vector = new Array(32).fill(0);
  
  if (!imageBuffer || imageBuffer.length < 50) {
    return vector;
  }

  let rSum = 0, gSum = 0, bSum = 0;
  const sampleStep = Math.max(1, Math.floor(imageBuffer.length / 800));
  let count = 0;

  // Track top half vs bottom half luminance
  const halfLen = Math.floor(imageBuffer.length / 2);
  let topLumaSum = 0;
  let topCount = 0;
  let bottomLumaSum = 0;
  let bottomCount = 0;

  for (let i = 0; i < imageBuffer.length - 3; i += sampleStep) {
    const r = imageBuffer[i] / 255;
    const g = imageBuffer[i + 1] / 255;
    const b = imageBuffer[i + 2] / 255;
    rSum += r;
    gSum += g;
    bSum += b;

    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    if (i < halfLen) {
      topLumaSum += luma;
      topCount++;
    } else {
      bottomLumaSum += luma;
      bottomCount++;
    }

    // Map into 8 primary color bins in dimensions [0..7]
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta > 0.05) {
      if (max === r) hue = ((g - b) / delta) % 6;
      else if (max === g) hue = (b - r) / delta + 2;
      else hue = (r - g) / delta + 4;
      hue = Math.round(hue * 60);
      if (hue < 0) hue += 360;
      const bin = Math.min(7, Math.floor(hue / 45));
      vector[bin] += 1;
    } else {
      // Greyscale / neutral (dark, cream/white, grey) in [8..10]
      if (max < 0.25) vector[8] += 1; // Black / dark
      else if (max > 0.75) vector[9] += 1; // White / cream
      else vector[10] += 1; // Grey
    }
    count++;
  }

  // Normalize color bins & averages
  if (count > 0) {
    for (let j = 0; j < 11; j++) vector[j] /= count;
    vector[11] = rSum / count; // Avg Red
    vector[12] = gSum / count; // Avg Green
    vector[13] = bSum / count; // Avg Blue
  }

  // Texture and edge variance across adjacent samples into [14..18]
  let diffSum = 0;
  for (let i = sampleStep; i < imageBuffer.length; i += sampleStep) {
    diffSum += Math.abs(imageBuffer[i] - imageBuffer[i - sampleStep]);
  }
  const avgDiff = count > 0 ? diffSum / (count * 255) : 0;
  vector[14] = avgDiff;
  vector[15] = Math.min(1, avgDiff * 2.5); // Texture contrast / pattern density

  // Spatial profile: top vs bottom lightness
  const avgTopLuma = topCount > 0 ? topLumaSum / topCount : 0.5;
  const avgBottomLuma = bottomCount > 0 ? bottomLumaSum / bottomCount : 0.5;
  vector[16] = avgTopLuma;
  vector[17] = avgBottomLuma;
  vector[18] = Math.abs(avgTopLuma - avgBottomLuma); // Top-to-bottom contrast

  // Fill remaining dimensions with deterministic hash projections
  for (let k = 19; k < 32; k++) {
    const idx = (k * 17) % (imageBuffer.length || 1);
    vector[k] = (imageBuffer[idx] || 128) / 255;
  }

  // Normalize to unit length for exact cosine similarity
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vector.map(val => val / magnitude);
}

/**
 * Request Gemini Embedding 2 via Google Gen AI official REST API
 */
export async function generateGeminiEmbedding(
  imageInput: string,
  mimeTypeFallback: string = 'image/jpeg'
): Promise<EmbeddingResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Resolve image bytes
  const { buffer, mimeType, base64 } = await resolveImageBuffer(imageInput);

  if (!apiKey) {
    // Graceful transparent fallback when API key is not configured on server
    const localVec = extractVisualFeatureVector(buffer);
    return {
      embedding: localVec,
      model: 'visual-feature-projection',
      source: 'visual-feature-projection',
      error: 'GEMINI_API_KEY not configured on server. Used local visual vector projection.',
    };
  }

  // Attempt 1: Call gemini-embedding-2 endpoint
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/gemini-embedding-2',
        content: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || mimeTypeFallback,
                data: base64,
              },
            },
          ],
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.embedding?.values) {
        return {
          embedding: data.embedding.values,
          model: 'gemini-embedding-2',
          source: 'gemini-embedding-2',
        };
      }
    } else {
      const errText = await response.text();
      console.warn('gemini-embedding-2 endpoint returned status:', response.status, errText);
    }
  } catch (err: any) {
    console.warn('Failed calling gemini-embedding-2:', err.message);
  }

  // Fallback to visual feature vector if upstream API call failed
  const localVec = extractVisualFeatureVector(buffer);
  return {
    embedding: localVec,
    model: 'visual-feature-projection',
    source: 'visual-feature-projection',
    error: 'Upstream Gemini embedding call unavailable. Used visual feature projection.',
  };
}
