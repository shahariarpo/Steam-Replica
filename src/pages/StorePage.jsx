import {
  HERO_GAMES,
  SPECIAL_OFFERS,
  TOP_SELLERS,
  NEW_RELEASES,
  COMING_SOON,
  DAILY_DEALS,
} from '../data/gamesData';
import HeroCarousel from '../components/HeroCarousel';
import GameGrid from '../components/GameGrid';

export default function StorePage() {
  const heroGames = HERO_GAMES;
  const specials = SPECIAL_OFFERS.slice(0, 8);
  const topSellers = TOP_SELLERS.slice(0, 8);
  const newReleases = NEW_RELEASES.slice(0, 8);
  const comingSoon = COMING_SOON.slice(0, 4);
  const dailyDeals = DAILY_DEALS.slice(0, 2);

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-10" id="store-page">
      {/* Hero Carousel */}
      <section className="animate-fade-in-up">
        <HeroCarousel games={heroGames} />
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
        loading={false}
      />

      {/* Top Sellers */}
      <GameGrid
        title="Top Sellers"
        games={topSellers}
        loading={false}
      />

      {/* New Releases */}
      <GameGrid
        title="New & Trending"
        games={newReleases}
        loading={false}
      />

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <GameGrid
          title="Coming Soon"
          games={comingSoon}
          loading={false}
        />
      )}
    </main>
  );
}
