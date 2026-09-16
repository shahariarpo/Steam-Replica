import { Link } from 'react-router';
import PlatformIcons from './PlatformIcons';

export default function GameCard({ game }) {
  const formatPrice = (cents) => {
    if (!cents || cents === 0) return 'Free';
    return `$${(cents / 100).toFixed(2)}`;
  };

  const isDiscounted = game.discount_percent > 0;

  return (
    <Link
      to={`/app/${game.id}`}
      className="group block bg-steam-card-bg rounded-lg overflow-hidden card-glow transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
      id={`game-card-${game.id}`}
    >
      {/* Cover image */}
      <div className="relative aspect-[460/215] overflow-hidden">
        <img
          src={game.header_image || game.large_capsule_image || game.small_capsule_image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-steam-darkest/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isDiscounted && (
          <div className="absolute top-2 right-2 bg-steam-green px-2 py-0.5 rounded text-xs font-bold text-steam-green-light shadow-lg shadow-steam-green/30">
            -{game.discount_percent}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-medium text-steam-text-bright truncate group-hover:text-steam-accent transition-colors duration-200">
          {game.name}
        </h3>

        <div className="flex items-center justify-between">
          <PlatformIcons
            windows={game.windows_available}
            mac={game.mac_available}
            linux={game.linux_available}
          />

          <div className="flex items-center gap-1.5">
            {isDiscounted ? (
              <>
                <span className="bg-steam-green/20 text-steam-green-light text-[11px] font-bold px-1.5 py-0.5 rounded">
                  -{game.discount_percent}%
                </span>
                <span className="price-strike text-xs">
                  {formatPrice(game.original_price)}
                </span>
                <span className="text-sm font-semibold text-steam-text-bright">
                  {formatPrice(game.final_price)}
                </span>
              </>
            ) : (
              <span className={`text-sm font-semibold ${
                game.final_price === 0 ? 'text-steam-green-light' : 'text-steam-text-bright'
              }`}>
                {formatPrice(game.final_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
