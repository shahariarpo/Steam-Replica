import { useState, useEffect, useRef } from 'react';

const cache = new Map();

export function useSteamApi(endpoint, options = {}) {
  const { enabled = true, fallbackData = null } = options;

  // Initialize with cached or fallback data immediately for instant 0ms paint
  const [data, setData] = useState(() => cache.get(endpoint) || fallbackData || null);
  const [loading, setLoading] = useState(() => !cache.has(endpoint) && !fallbackData);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !endpoint) return;

    if (cache.has(endpoint)) {
      setData(cache.get(endpoint));
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s fast timeout

    async function fetchData() {
      try {
        const res = await fetch(`/steam-api${endpoint}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const contentType = res.headers.get('content-type') || '';
        let json;
        if (contentType.includes('application/json')) {
          json = await res.json();
        } else {
          const text = await res.text();
          json = JSON.parse(text);
        }

        if (isMounted.current && json) {
          cache.set(endpoint, json);
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.warn(`Fetch timed out for ${endpoint}, using fallback data.`);
        } else {
          console.warn(`Fetch failed for ${endpoint}:`, err.message);
        }

        if (isMounted.current) {
          if (fallbackData) {
            setData((prev) => prev || fallbackData);
          } else {
            setError(err.message);
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [endpoint, enabled, fallbackData]);

  return { data, loading, error };
}

export function clearApiCache() {
  cache.clear();
}
