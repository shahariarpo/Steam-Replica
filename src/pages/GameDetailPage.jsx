import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import {
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaCheck,
  FaArrowLeft,
  FaClock,
  FaBookmark,
} from 'react-icons/fa';
import { GAMES_BY_ID, ALL_GAMES } from '../data/gamesData';
import { useCart } from '../hooks/useCart';
import PlatformIcons from '../components/PlatformIcons';
import GameCard from '../components/GameCard';

export default function GameDetailPage() {
  const { appId } = useParams();
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, isInCart } = useCart();

  const game = useMemo(() => {
    if (!appId) return null;
    return GAMES_BY_ID[Number(appId)] || GAMES_BY_ID[appId] || null;
  }, [appId]);

  const isComingSoon = game?.coming_soon || game?.release_date?.coming_soon;

  const formatPrice = (cents) => {
    if (!cents || cents === 0) return 'Free to Play';
    return `$${(cents / 100).toFixed(2)}`;
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  // 404 / Game not found
  if (!game) {
    return (
      <main className="max-w-[1200px] mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-steam-text-bright">Game Not Found</h1>
        <p className="text-steam-text-dim text-sm max-w-md mx-auto">
          The requested title could not be found in our games catalog.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-steam-accent hover:bg-steam-accent-hover text-steam-text-bright font-semibold rounded text-sm transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </main>
    );
  }

  const screenshots = game.screenshots || [];
  const genres = game.genres || [];
  const categories = game.categories || [];
  const priceOverview = game.price_overview || {
    initial: game.original_price || 0,
    final: game.final_price || 0,
    discount_percent: game.discount_percent || 0,
    currency: game.currency || 'USD',
  };
  const pcReq = game.pc_requirements;
  const inCart = isInCart(game.id);

  const handleAddToCart = () => {
    if (inCart || isComingSoon) return;
    addToCart({
      id: game.id,
      name: game.name,
      header_image: game.header_image,
      small_capsule_image: game.small_capsule_image || game.header_image,
      original_price: priceOverview?.initial || 0,
      final_price: priceOverview?.final || 0,
      discount_percent: priceOverview?.discount_percent || 0,
      currency: priceOverview?.currency || 'USD',
    });
  };

  const prevScreenshot = () => {
    setSelectedScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const nextScreenshot = () => {
    setSelectedScreenshot((prev) => (prev + 1) % screenshots.length);
  };

  // Similar games suggestions
  const relatedGames = ALL_GAMES.filter((g) => g.id !== game.id).slice(0, 4);

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-10" id="game-detail-page">
      <div>
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-steam-accent hover:text-steam-accent-hover transition-colors mb-4"
        >
          <FaArrowLeft className="text-xs" /> Back to Store
        </Link>

        {/* Game title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-steam-text-bright mb-4">
          {game.name}
        </h1>

        {/* Unreleased Notice Banner for Coming Soon titles like GTA VI */}
        {isComingSoon && (
          <div className="mb-6 bg-sky-950/40 border border-sky-500/40 rounded-lg p-4 flex items-center gap-3.5 shadow-lg shadow-sky-950/30">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-lg text-lg flex-shrink-0">
              <FaClock />
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-sky-300">
                This title has not been released yet
              </h2>
              <p className="text-xs md:text-sm text-steam-text-dim">
                Planned Release Date: <span className="text-steam-text-bright font-semibold">{game.release_date?.date || 'To be announced'}</span>. Add it to your wishlist to get notified when it becomes available!
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: screenshots + description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Screenshot carousel */}
            {screenshots.length > 0 && (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden group">
                  <img
                    src={screenshots[selectedScreenshot]?.path_full || game.large_capsule_image || game.header_image}
                    alt={`${game.name} screenshot ${selectedScreenshot + 1}`}
                    className="w-full aspect-video object-cover"
                  />
                  {screenshots.length > 1 && (
                    <>
                      <button
                        onClick={prevScreenshot}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-steam-darkest/70 hover:bg-steam-darkest/90 rounded-full text-steam-text opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Previous screenshot"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={nextScreenshot}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-steam-darkest/70 hover:bg-steam-darkest/90 rounded-full text-steam-text opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Next screenshot"
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {screenshots.slice(0, 10).map((ss, i) => (
                    <button
                      key={ss.id || i}
                      onClick={() => setSelectedScreenshot(i)}
                      className={`flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                        i === selectedScreenshot
                          ? 'border-steam-accent'
                          : 'border-transparent hover:border-steam-text-dim/50'
                      }`}
                    >
                      <img
                        src={ss.path_thumbnail || ss.path_full}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-28 h-16 object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-steam-card-bg rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-steam-text-bright">About This Game</h2>
              <p className="text-sm text-steam-text leading-relaxed whitespace-pre-line">
                {stripHtml(game.about_the_game || game.short_description)}
              </p>
            </div>

            {/* System Requirements */}
            {pcReq && (typeof pcReq === 'object') && (pcReq.minimum || pcReq.recommended) && (
              <div className="bg-steam-card-bg rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-steam-text-bright">System Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pcReq.minimum && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-steam-accent">Minimum</h3>
                      <div
                        className="text-xs text-steam-text-dim leading-relaxed [&_strong]:text-steam-text [&_br]:leading-loose"
                        dangerouslySetInnerHTML={{ __html: pcReq.minimum }}
                      />
                    </div>
                  )}
                  {pcReq.recommended && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-steam-accent">Recommended</h3>
                      <div
                        className="text-xs text-steam-text-dim leading-relaxed [&_strong]:text-steam-text [&_br]:leading-loose"
                        dangerouslySetInnerHTML={{ __html: pcReq.recommended }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column: price, tags, details */}
          <div className="space-y-4">
            {/* Header image */}
            <img
              src={game.header_image}
              alt={game.name}
              className="w-full rounded-lg"
            />

            {/* Short description */}
            <p className="text-sm text-steam-text-dim leading-relaxed">
              {game.short_description}
            </p>

            {/* Meta info */}
            <div className="space-y-2 text-sm bg-steam-card-bg/40 p-4 rounded-lg">
              {game.developers && (
                <div className="flex gap-2">
                  <span className="text-steam-text-dim">Developer:</span>
                  <span className="text-steam-accent">{game.developers.join(', ')}</span>
                </div>
              )}
              {game.publishers && (
                <div className="flex gap-2">
                  <span className="text-steam-text-dim">Publisher:</span>
                  <span className="text-steam-accent">{game.publishers.join(', ')}</span>
                </div>
              )}
              {game.release_date && (
                <div className="flex gap-2">
                  <span className="text-steam-text-dim">Release Date:</span>
                  <span className="text-steam-text font-medium">{game.release_date.date}</span>
                </div>
              )}
            </div>

            {/* Platforms */}
            {game.platforms && (
              <div className="flex items-center gap-2 bg-steam-card-bg/40 px-4 py-2.5 rounded-lg">
                <span className="text-sm text-steam-text-dim">Platforms:</span>
                <PlatformIcons
                  windows={game.platforms.windows || game.windows_available}
                  mac={game.platforms.mac || game.mac_available}
                  linux={game.platforms.linux || game.linux_available}
                  className="text-base"
                />
              </div>
            )}

            {/* Tags / Genres */}
            {genres.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-steam-text-dim uppercase tracking-wider">Popular Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {genres.map((g) => (
                    <span
                      key={g.id || g.description}
                      className="px-2.5 py-1 bg-steam-medium/60 text-steam-accent text-xs rounded hover:bg-steam-medium transition-colors cursor-default"
                    >
                      {g.description}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metacritic */}
            {game.metacritic && game.metacritic.score && (
              <div className="flex items-center gap-3 p-3 bg-steam-card-bg rounded-lg">
                <div className={`w-12 h-12 rounded flex items-center justify-center text-xl font-bold ${
                  game.metacritic.score >= 75 ? 'bg-green-600' :
                  game.metacritic.score >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                } text-white`}>
                  {game.metacritic.score}
                </div>
                <div>
                  <div className="text-sm font-semibold text-steam-text-bright">Metacritic</div>
                  <div className="text-xs text-steam-text-dim">
                    {game.metacritic.score >= 75 ? 'Generally Favorable' :
                     game.metacritic.score >= 50 ? 'Mixed' : 'Generally Unfavorable'}
                  </div>
                </div>
              </div>
            )}

            {/* Action Box: Buy / In Cart OR Wishlist for unreleased games */}
            <div className="bg-steam-darkest border border-white/5 rounded-lg p-5 space-y-4">
              {isComingSoon ? (
                <>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Coming Soon</span>
                    <h3 className="text-base font-bold text-steam-text-bright">
                      Planned Release: {game.release_date?.date || 'TBA'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-full py-3 rounded font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isWishlisted
                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                        : 'bg-steam-accent hover:bg-steam-accent-hover text-steam-text-bright hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                    id="wishlist-btn"
                  >
                    {isWishlisted ? (
                      <>
                        <FaCheck /> On Wishlist
                      </>
                    ) : (
                      <>
                        <FaBookmark /> Add to Wishlist
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-steam-text-bright">
                    Buy {game.name}
                  </h3>
                  {game.is_free ? (
                    <div className="text-center py-1">
                      <span className="text-xl font-bold text-steam-green-light">Free to Play</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {priceOverview.discount_percent > 0 && (
                          <span className="bg-steam-green px-2.5 py-1 rounded text-base font-bold text-steam-green-light">
                            -{priceOverview.discount_percent}%
                          </span>
                        )}
                        {priceOverview.discount_percent > 0 && (
                          <span className="price-strike text-sm">
                            {formatPrice(priceOverview.initial)}
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-bold text-steam-text-bright">
                        {formatPrice(priceOverview.final)}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddToCart}
                    disabled={inCart}
                    className={`w-full py-3 rounded font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      inCart
                        ? 'bg-steam-medium text-steam-text cursor-default'
                        : 'bg-steam-green hover:bg-steam-green-light text-steam-text-bright hover:text-steam-darkest hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                    id="add-to-cart-btn"
                  >
                    {inCart ? (
                      <>
                        <FaCheck /> In Cart
                      </>
                    ) : (
                      <>
                        <FaShoppingCart /> Add to Cart
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-steam-text-dim uppercase tracking-wider">Features</h3>
                <div className="flex flex-wrap gap-1.5">
                  {categories.slice(0, 10).map((c) => (
                    <span
                      key={c.id || c.description}
                      className="px-2 py-0.5 bg-steam-card-bg text-steam-text-dim text-xs rounded border border-white/5"
                    >
                      {c.description}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* More Like This section */}
      <section className="space-y-4 pt-6 border-t border-white/5">
        <h2 className="text-lg font-bold text-steam-text-bright">More Games Like This</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedGames.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </section>
    </main>
  );
}
