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

    let response = await fetch(targetUrl, { headers });

    // If Steam blocks direct cloud IP or returns error, try fallback public proxy
    if (!response.ok) {
      const fallbackUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      try {
        const fallbackRes = await fetch(fallbackUrl);
        if (fallbackRes.ok) {
          response = fallbackRes;
        }
      } catch {
        // Continue with original response
      }
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Steam API failed with status ${response.status}`,
      });
    }

    const data = await response.json();

    // Cache on Vercel edge for 5 minutes (300s) to avoid Steam rate-limiting
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal proxy error' });
  }
}
