import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';

export default function HeroCarousel({ games = [] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState('right');
  const navigate = useNavigate();

  const total = games.length;

  const next = useCallback(() => {
    setDirection('right');
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection('left');
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next, total]);

  if (total === 0) {
    return (
      <div className="w-full aspect-[16/7] bg-steam-card-bg rounded-xl skeleton" />
    );
  }

  const game = games[current];
  const isComingSoon = game.coming_soon || game.release_date?.coming_soon;

  const formatPrice = (cents) => {
    if (!cents || cents === 0) return 'Free to Play';
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden group hero-ambient"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      id="hero-carousel"
    >
      {/* Main banner */}
      <div
        className="relative aspect-[16/7] md:aspect-[16/6] cursor-pointer overflow-hidden"
        onClick={() => navigate(`/app/${game.id}`)}
      >
        <img
          src={game.large_capsule_image || game.header_image}
          alt={game.name}
          className="w-full h-full object-cover animate-slide-in"
          key={`hero-${game.id}-${current}`}
        />

        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-steam-darkest via-steam-darkest/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-steam-darkest/70 via-transparent to-transparent" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <h2
            className="text-xl md:text-3xl lg:text-4xl font-bold text-steam-text-bright mb-2 drop-shadow-lg animate-fade-in-up"
            key={`title-${game.id}-${current}`}
          >
            {game.name}
          </h2>
          <div className="flex items-center gap-3 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {isComingSoon ? (
              <span className="inline-flex items-center gap-2 bg-sky-600/90 text-white px-3 py-1 rounded-md text-sm md:text-base font-bold shadow-lg shadow-sky-600/30">
                <FaClock className="text-sm" /> Coming Soon • {game.release_date?.date || 'TBA'}
              </span>
            ) : game.discount_percent > 0 ? (
              <>
                <span className="bg-steam-green px-3 py-1 rounded-md text-sm md:text-base font-bold text-steam-green-light shadow-lg shadow-steam-green/30">
                  -{game.discount_percent}%
                </span>
                <span className="price-strike text-sm md:text-base">
                  {formatPrice(game.original_price)}
                </span>
                <span className="text-steam-text-bright font-bold text-sm md:text-lg">
                  {formatPrice(game.final_price)}
                </span>
              </>
            ) : (
              <span className="text-steam-text-bright font-bold text-sm md:text-lg">
                {game.is_free ? 'Free to Play' : formatPrice(game.final_price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation arrows — glassmorphic */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-3 glass rounded-full text-steam-text hover:text-steam-text-bright transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Previous game"
      >
        <FaChevronLeft className="text-lg" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 glass rounded-full text-steam-text hover:text-steam-text-bright transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Next game"
      >
        <FaChevronRight className="text-lg" />
      </button>

      {/* Thumbnail strip + dot indicators */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-steam-darkest/90 to-transparent pt-8 pb-3">
        <div className="flex items-center justify-center gap-1.5 px-4">
          {games.map((g, i) => (
            <button
              key={g.id}
              onClick={(e) => { e.stopPropagation(); setDirection(i > current ? 'right' : 'left'); setCurrent(i); }}
              className={`rounded-full transition-all duration-500 ease-out ${
                i === current
                  ? 'w-8 h-2.5 bg-steam-accent shadow-lg shadow-steam-accent/40'
                  : 'w-2.5 h-2.5 bg-steam-text-dim/40 hover:bg-steam-text-dim/70'
              }`}
              aria-label={`Go to slide ${i + 1}: ${g.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
