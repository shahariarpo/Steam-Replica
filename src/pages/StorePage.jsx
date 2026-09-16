import { useMemo } from 'react';
import { useSteamApi } from '../hooks/useSteamApi';
import { fallbackFeatured, fallbackCategories } from '../data/fallbackGames';
import { useAdultFilter } from '../context/AdultFilterContext';
import { filterAdultGames } from '../utils/adultFilter';
import HeroCarousel from '../components/HeroCarousel';
import GameGrid from '../components/GameGrid';

export default function StorePage({ onSearchGamesReady }) {
  const { adultFilterEnabled } = useAdultFilter();

  const {
    data: featured,
    loading: featuredLoading,
    error: featuredError,
  } = useSteamApi('/api/featured/?l=english', { fallbackData: fallbackFeatured });

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSteamApi('/api/featuredcategories/?l=english', { fallbackData: fallbackCategories });

  // Prepare hero carousel items
  const heroGames = useMemo(() => {
    if (!featured) return [];
    const capsules = featured.large_capsules || [];
    const featuredWin = featured.featured_win || [];
    const rawGames = [...capsules, ...featuredWin.slice(0, 3)];
    const cleanGames = filterAdultGames(rawGames, adultFilterEnabled);
    return cleanGames.slice(0, 8);
  }, [featured, adultFilterEnabled]);

  // Collect all games for search
  const allGames = useMemo(() => {
    if (!categories) return [];
    const gameMap = new Map();
    const sections = ['specials', 'top_sellers', 'new_releases', 'coming_soon'];
    for (const key of sections) {
      const items = categories[key]?.items || [];
      for (const item of items) {
        if (!gameMap.has(item.id)) gameMap.set(item.id, item);
      }
    }
    if (featured) {
      for (const g of [...(featured.large_capsules || []), ...(featured.featured_win || [])]) {
        if (!gameMap.has(g.id)) gameMap.set(g.id, g);
      }
    }
    const combined = Array.from(gameMap.values());
    return filterAdultGames(combined, adultFilterEnabled);
  }, [categories, featured, adultFilterEnabled]);

  // Pass search games up to App
  useMemo(() => {
    if (onSearchGamesReady && allGames.length > 0) {
      onSearchGamesReady(allGames);
    }
  }, [allGames, onSearchGamesReady]);

  const specials = useMemo(
    () => filterAdultGames(categories?.specials?.items || [], adultFilterEnabled).slice(0, 8),
    [categories, adultFilterEnabled]
  );
  const topSellers = useMemo(
    () => filterAdultGames(categories?.top_sellers?.items || [], adultFilterEnabled).slice(0, 8),
    [categories, adultFilterEnabled]
  );
  const newReleases = useMemo(
    () => filterAdultGames(categories?.new_releases?.items || [], adultFilterEnabled).slice(0, 8),
    [categories, adultFilterEnabled]
  );
  const comingSoon = useMemo(
    () => filterAdultGames(categories?.coming_soon?.items || [], adultFilterEnabled).slice(0, 4),
    [categories, adultFilterEnabled]
  );
  const dailyDeals = useMemo(
    () => filterAdultGames(categories?.['6']?.items || [], adultFilterEnabled).slice(0, 2),
    [categories, adultFilterEnabled]
  );

  // Show error banner if both APIs failed
  const hasError = featuredError && categoriesError && !featured && !categories;

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-10" id="store-page">
      {/* Error banner */}
      {hasError && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-center animate-fade-in-up">
          <p className="text-red-300 text-sm">
            ⚠️ Could not connect to Steam. Showing cached data.
          </p>
        </div>
      )}

      {/* Hero Carousel */}
      <section className="animate-fade-in-up">
        {featuredLoading ? (
          <div className="w-full aspect-[16/7] md:aspect-[16/6] skeleton rounded-xl" />
        ) : (
          <HeroCarousel games={heroGames} />
        )}
      </section>

      {/* Spotlights / Daily Deal banner */}
      {dailyDeals.length > 0 && (
        <section className="animate-fade-in-up">
          <div className="section-divider mb-4" />
          <h2 className="text-lg md:text-xl font-bold text-steam-text-bright tracking-tight mb-4">
            Daily Deal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyDeals.map((deal) => (
              <a
                key={deal.id}
                href={`/app/${deal.id}`}
                className="group relative rounded-lg overflow-hidden bg-steam-card-bg card-glow transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={deal.header_image}
                  alt={deal.name}
                  className="w-full aspect-[460/215] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-steam-darkest via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-base font-semibold text-steam-text-bright mb-1">{deal.name}</h3>
                  {deal.discount_percent > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="bg-steam-green px-2 py-0.5 rounded text-sm font-bold text-steam-green-light">
                        -{deal.discount_percent}%
                      </span>
                      <span className="price-strike text-sm">${(deal.original_price / 100).toFixed(2)}</span>
                      <span className="text-steam-text-bright font-bold">${(deal.final_price / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Special Offers */}
      <GameGrid
        title="Special Offers"
        games={specials}
        loading={categoriesLoading}
      />

      {/* Top Sellers */}
      <GameGrid
        title="Top Sellers"
        games={topSellers}
        loading={categoriesLoading}
      />

      {/* New Releases */}
      <GameGrid
        title="New Releases"
        games={newReleases}
        loading={categoriesLoading}
      />

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <GameGrid
          title="Coming Soon"
          games={comingSoon}
          loading={categoriesLoading}
        />
      )}
    </main>
  );
}
