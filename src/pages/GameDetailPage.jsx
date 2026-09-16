import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { FaChevronLeft, FaChevronRight, FaShoppingCart, FaCheck, FaArrowLeft, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useSteamApi } from '../hooks/useSteamApi';
import { useCart } from '../hooks/useCart';
import { useAdultFilter } from '../context/AdultFilterContext';
import { isAdultGame } from '../utils/adultFilter';
import PlatformIcons from '../components/PlatformIcons';

export default function GameDetailPage() {
  const { appId } = useParams();
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [bypassedWarning, setBypassedWarning] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { adultFilterEnabled, toggleAdultFilter } = useAdultFilter();

  const { data: rawData, loading, error } = useSteamApi(
    `/api/appdetails?appids=${appId}`,
    { enabled: !!appId }
  );

  const game = useMemo(() => {
    if (!rawData || !rawData[appId]) return null;
    const entry = rawData[appId];
    if (!entry.success) return null;
    return entry.data;
  }, [rawData, appId]);

  const isAdult = useMemo(() => {
    return game ? isAdultGame(game) : false;
  }, [game]);

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

  // Loading state
  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
        <div className="skeleton h-6 w-32 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton aspect-video rounded-lg" />
            <div className="flex gap-2 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton w-24 h-14 rounded flex-shrink-0" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-20 rounded" />
            <div className="skeleton h-12 rounded" />
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !game) {
    return (
      <main className="max-w-[1200px] mx-auto px-4 py-12 text-center">
        <p className="text-steam-text-dim text-lg mb-4">
          {error || 'Game not found'}
        </p>
        <Link to="/" className="text-steam-accent hover:text-steam-accent-hover transition-colors">
          ← Back to Store
        </Link>
      </main>
    );
  }

  // Adult Content Gate
  if (isAdult && adultFilterEnabled && !bypassedWarning) {
    const descriptorNotes = game.content_descriptors?.notes;
    return (
      <main className="max-w-[800px] mx-auto px-4 py-12" id="adult-content-warning-gate">
        <div className="bg-steam-card-bg border border-amber-500/30 rounded-xl p-6 md:p-10 space-y-6 shadow-2xl animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-2xl">
              <FaShieldAlt />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-steam-text-bright">
                Adult Content Warning
              </h1>
              <p className="text-sm text-steam-text-dim">
                Filtered product ({game.name})
              </p>
            </div>
          </div>

          <div className="bg-steam-darkest/70 rounded-lg p-4 border border-white/5 space-y-3">
            <p className="text-sm text-steam-text leading-relaxed">
              This title contains adult only / mature sexual content and is filtered according to your active safe browsing preferences.
            </p>
            {descriptorNotes && (
              <div className="text-xs text-steam-text-dim border-t border-white/5 pt-3 whitespace-pre-line italic">
                {descriptorNotes}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-steam-accent hover:bg-steam-accent-hover text-steam-text-bright font-semibold rounded text-sm transition-colors text-center"
            >
              ← Back to Store
            </Link>
            <button
              onClick={() => setBypassedWarning(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-steam-medium hover:bg-steam-medium/80 text-steam-text font-medium rounded text-sm transition-colors text-center"
            >
              View Page Anyway
            </button>
            <button
              onClick={toggleAdultFilter}
              className="w-full sm:w-auto px-4 py-2.5 text-xs text-amber-400/80 hover:text-amber-300 underline transition-colors text-center sm:ml-auto"
            >
              Turn off adult filter
            </button>
          </div>
        </div>
      </main>
    );
  }

  const screenshots = game.screenshots || [];
  const genres = game.genres || [];
  const categories = game.categories || [];
  const priceOverview = game.price_overview;
  const pcReq = game.pc_requirements;
  const inCart = isInCart(Number(appId));

  const handleAddToCart = () => {
    if (inCart) return;
    addToCart({
      id: Number(appId),
      name: game.name,
      header_image: game.header_image,
      small_capsule_image: game.header_image,
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

  return (
    <main className="max-w-[1200px] mx-auto px-4 py-6" id="game-detail-page">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-steam-accent hover:text-steam-accent-hover transition-colors mb-6"
      >
        <FaArrowLeft className="text-xs" /> Back to Store
      </Link>

      {/* Game title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-steam-text-bright mb-6">
        {game.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: screenshots + description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Screenshot carousel */}
          {screenshots.length > 0 && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden group">
                <img
                  src={screenshots[selectedScreenshot]?.path_full}
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
                    key={ss.id}
                    onClick={() => setSelectedScreenshot(i)}
                    className={`flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                      i === selectedScreenshot
                        ? 'border-steam-accent'
                        : 'border-transparent hover:border-steam-text-dim/50'
                    }`}
                  >
                    <img
                      src={ss.path_thumbnail}
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
              {stripHtml(game.short_description || game.about_the_game)}
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
          <p className="text-sm text-steam-text-dim">
            {game.short_description}
          </p>

          {/* Meta info */}
          <div className="space-y-2 text-sm">
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
                <span className="text-steam-text">{game.release_date.date}</span>
              </div>
            )}
          </div>

          {/* Platforms */}
          {game.platforms && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-steam-text-dim">Platforms:</span>
              <PlatformIcons
                windows={game.platforms.windows}
                mac={game.platforms.mac}
                linux={game.platforms.linux}
                className="text-base"
              />
            </div>
          )}

          {/* Tags / Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => (
                <span
                  key={g.id}
                  className="px-2.5 py-1 bg-steam-medium/60 text-steam-accent text-xs rounded-full hover:bg-steam-medium transition-colors cursor-default"
                >
                  {g.description}
                </span>
              ))}
            </div>
          )}

          {/* Metacritic */}
          {game.metacritic && (
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

          {/* Price box + Add to Cart */}
          <div className="bg-steam-darkest rounded-lg p-4 space-y-3">
            {game.is_free ? (
              <div className="text-center">
                <span className="text-lg font-bold text-steam-green-light">Free to Play</span>
              </div>
            ) : priceOverview ? (
              <div className="flex items-center justify-center gap-3">
                {priceOverview.discount_percent > 0 && (
                  <span className="bg-steam-green px-3 py-1.5 rounded text-lg font-bold text-steam-green-light">
                    -{priceOverview.discount_percent}%
                  </span>
                )}
                <div className="text-right">
                  {priceOverview.discount_percent > 0 && (
                    <div className="price-strike text-sm">
                      {formatPrice(priceOverview.initial)}
                    </div>
                  )}
                  <div className="text-xl font-bold text-steam-text-bright">
                    {formatPrice(priceOverview.final)}
                  </div>
                </div>
              </div>
            ) : null}

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
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-steam-text-dim">Features</h3>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 10).map((c) => (
                  <span
                    key={c.id}
                    className="px-2 py-0.5 bg-steam-card-bg text-steam-text-dim text-xs rounded"
                  >
                    {c.description}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
