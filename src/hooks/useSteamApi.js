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

      try {
        const url = `/steam-api${endpoint}`;
        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Steam API error: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        cache.set(endpoint, json);
        setData(json);
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
