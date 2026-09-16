import GameCard from './GameCard';

export default function GameGrid({ title, games = [], loading = false }) {
  if (loading) {
    return (
      <section className="space-y-4 animate-fade-in-up">
        <div className="skeleton h-7 w-48 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton aspect-[460/215] rounded-lg" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!games || games.length === 0) return null;

  return (
    <section className="space-y-4 animate-fade-in-up" id={`section-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Section divider */}
      <div className="section-divider mb-2" />
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-bold text-steam-text-bright tracking-tight">
          {title}
          <span className="ml-2 text-xs font-normal text-steam-text-dim align-middle">
            ({games.length})
          </span>
        </h2>
        <button className="text-sm text-steam-accent hover:text-steam-accent-hover transition-colors duration-200 hover:underline underline-offset-4">
          See more →
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
