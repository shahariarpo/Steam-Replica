import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FaSearch, FaClock } from 'react-icons/fa';

export default function SearchBar({ games = [] }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (query.trim().length <= 1) return [];
    return games
      .filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }, [games, query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (game) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/app/${game.id}`);
  };

  const formatPrice = (game) => {
    const isComingSoon = game.coming_soon || game.release_date?.coming_soon;
    if (isComingSoon) {
      return game.release_date?.date ? `Coming Soon (${game.release_date.date})` : 'Coming Soon';
    }
    if (!game.final_price || game.final_price === 0 || game.is_free) {
      return 'Free to Play';
    }
    return `$${(game.final_price / 100).toFixed(2)}`;
  };

  return (
    <div ref={wrapperRef} className="relative" id="search-bar">
      <div className="flex items-center bg-steam-input-bg/50 rounded overflow-hidden">
        <input
          type="text"
          placeholder="Search the store"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') { setIsOpen(false); setQuery(''); }
          }}
          className="bg-transparent text-steam-text placeholder-steam-text-dim px-3 py-1.5 text-sm outline-none w-36 md:w-52 lg:w-64"
          id="search-input"
        />
        <button className="px-3 py-1.5 bg-steam-accent/20 hover:bg-steam-accent/40 transition-colors" aria-label="Search">
          <FaSearch className="text-steam-text text-sm" />
        </button>
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-steam-darkest border border-steam-border rounded-md shadow-2xl z-50 max-h-80 overflow-y-auto min-w-72">
          {filtered.map((game) => {
            const isComingSoon = game.coming_soon || game.release_date?.coming_soon;
            return (
              <button
                key={game.id}
                onClick={() => handleSelect(game)}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-steam-medium/50 transition-colors text-left group"
              >
                <img
                  src={game.small_capsule_image || game.header_image}
                  alt={game.name}
                  className="w-24 h-9 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-steam-text-bright truncate group-hover:text-steam-accent transition-colors">
                    {game.name}
                  </div>
                  <div className="text-xs text-steam-text-dim flex items-center gap-1.5 mt-0.5">
                    {isComingSoon ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 bg-sky-950/70 border border-sky-500/30 px-1.5 py-0.5 rounded">
                        <FaClock className="text-[9px]" /> {game.release_date?.date ? `Coming Soon (${game.release_date.date})` : 'Coming Soon'}
                      </span>
                    ) : (
                      <>
                        {game.discount_percent > 0 && (
                          <span className="bg-steam-green/20 text-steam-green-light px-1 py-0.2 rounded text-[10px] font-bold">
                            -{game.discount_percent}%
                          </span>
                        )}
                        <span>{formatPrice(game)}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
