import { useState, useEffect, useRef } from 'react';

const cache = new Map();

export function useSteamApi(endpoint, options = {}) {
  const { enabled = true, fallbackData = null } = options;
  const [data, setData] = useState(() => cache.get(endpoint) || null);
  const [loading, setLoading] = useState(!cache.has(endpoint));
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled || !endpoint) return;

    if (cache.has(endpoint)) {
      setData(cache.get(endpoint));
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    async function fetchData() {
      setLoading(true);
      setError(null);

      // Helper to safely parse JSON or throw
      const tryFetchJson = async (url) => {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          // If server returned HTML (e.g. index.html SPA fallback), reject so we try alternative
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch {
            throw new Error('Non-JSON response received');
          }
        }
        return await res.json();
      };

      try {
        let json = null;

        // 1. First attempt: Direct proxy endpoint (/steam-api/...)
        try {
          json = await tryFetchJson(`/steam-api${endpoint}`);
        } catch (proxyErr) {
          if (controller.signal.aborted) return;
          console.warn(`Primary proxy fetch failed for ${endpoint}:`, proxyErr.message);

          // 2. Second attempt: Client-side CORS proxy
          try {
            const steamFullUrl = `https://store.steampowered.com${endpoint}`;
            const publicProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(steamFullUrl)}`;
            json = await tryFetchJson(publicProxyUrl);
          } catch (altErr) {
            if (controller.signal.aborted) return;
            console.warn(`Alternative proxy fetch failed for ${endpoint}:`, altErr.message);
            throw altErr;
          }
        }

        if (json) {
          cache.set(endpoint, json);
          setData(json);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error(`Failed to fetch ${endpoint}:`, err);
        setError(err.message);

        if (fallbackData) {
          setData(fallbackData);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [endpoint, enabled, fallbackData]);

  return { data, loading, error };
}

export function clearApiCache() {
  cache.clear();
}
