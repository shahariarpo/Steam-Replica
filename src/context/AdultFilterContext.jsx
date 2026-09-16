import { createContext, useContext, useState, useEffect } from 'react';

const AdultFilterContext = createContext();

const STORAGE_KEY = 'steam_adult_filter_enabled';

export function AdultFilterProvider({ children }) {
  const [adultFilterEnabled, setAdultFilterEnabledState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adultFilterEnabled));
    } catch (err) {
      console.error('Failed to save adult filter setting:', err);
    }
  }, [adultFilterEnabled]);

  const toggleAdultFilter = () => {
    setAdultFilterEnabledState((prev) => !prev);
  };

  const setAdultFilter = (enabled) => {
    setAdultFilterEnabledState(Boolean(enabled));
  };

  return (
    <AdultFilterContext.Provider
      value={{
        adultFilterEnabled,
        toggleAdultFilter,
        setAdultFilter,
      }}
    >
      {children}
    </AdultFilterContext.Provider>
  );
}

export function useAdultFilter() {
  const context = useContext(AdultFilterContext);
  if (!context) {
    throw new Error('useAdultFilter must be used within an AdultFilterProvider');
  }
  return context;
}
