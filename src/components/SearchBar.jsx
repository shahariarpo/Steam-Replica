import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FaSearch } from 'react-icons/fa';
import { useAdultFilter } from '../context/AdultFilterContext';
import { filterAdultGames } from '../utils/adultFilter';

export default function SearchBar({ games = [] }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const { adultFilterEnabled } = useAdultFilter();

  const filtered = useMemo(() => {
    if (query.trim().length <= 1) return [];
    const cleanPool = filterAdultGames(games, adultFilterEnabled);
    return cleanPool
      .filter((g) => g.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }, [games, query, adultFilterEnabled]);

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

  const formatPrice = (cents) => {
    if (!cents || cents === 0) return 'Free';
    return `$${(cents / 100).toFixed(2)}`;
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
          {filtered.map((game) => (
            <button
              key={game.id}
              onClick={() => handleSelect(game)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-steam-medium/50 transition-colors text-left"
            >
              <img
                src={game.small_capsule_image || game.header_image}
                alt={game.name}
                className="w-24 h-9 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-steam-text-bright truncate">{game.name}</div>
                <div className="text-xs text-steam-text-dim">
                  {game.discount_percent > 0 && (
                    <span className="text-steam-green-light mr-1">-{game.discount_percent}%</span>
                  )}
                  {formatPrice(game.final_price)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
