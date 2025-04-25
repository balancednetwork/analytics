import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  // Check if it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const plausibleApiKey = process.env.VITE_PLAUSIBLE_API_KEY;

  if (!plausibleApiKey) {
    console.error('Plausible API key not found in environment variables');
    return res.status(500).json({ error: 'Plausible API key not configured' });
  }

  try {
    // Log request body for debugging
    console.log('Request body:', req.body);

    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await fetch('https://plausible.io/api/v2/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${plausibleApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Log Plausible API response status
    console.log('Plausible API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Plausible API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Plausible API error',
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    // Log detailed error information
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return res.status(500).json({ 
      error: 'Failed to fetch data from Plausible',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 