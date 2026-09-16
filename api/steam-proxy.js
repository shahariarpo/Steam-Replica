export default async function handler(req, res) {
  // Allow CORS from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let path = req.query.path || '';
    if (Array.isArray(path)) {
      path = path.join('/');
    }

    // Collect query parameters excluding the internal 'path'
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'path') {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    }

    const queryString = queryParams.toString();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const targetUrl = `https://store.steampowered.com${cleanPath}${queryString ? `?${queryString}` : ''}`;

    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://store.steampowered.com/',
      'Origin': 'https://store.steampowered.com',
    };

    // Fast 3-second timeout so the serverless function never hangs
    const response = await fetch(targetUrl, {
      headers,
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Steam API responded with ${response.status}`,
      });
    }

    const data = await response.json();

    // Cache on Vercel CDN: 10 mins fresh, 24h stale-while-revalidate for blazing fast responses
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Proxy error' });
  }
}
