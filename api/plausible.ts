import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  const plausibleApiKey = process.env.VITE_PLAUSIBLE_API_KEY;

  if (!plausibleApiKey) {
    return res.status(500).json({ error: 'Plausible API key not configured' });
  }

  try {
    const response = await fetch('https://plausible.io/api/v2/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${plausibleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Plausible API error:', error);
    return res.status(500).json({ error: 'Failed to fetch data from Plausible' });
  }
} 