import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleSearch } from '../server/searchHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const response = await handleSearch(body);
    return res.status(response.success ? 200 : 400).json(response);
  } catch (err: any) {
    console.error('API /api/search error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while processing image search.',
    });
  }
}
