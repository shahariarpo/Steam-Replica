import { useState } from 'react';
import { Link } from 'react-router';
import { FaSteam, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import CartPanel from './CartPanel';

const NAV_LINKS = [
  { label: 'Store', to: '/' },
  { label: 'Community', to: '#' },
  { label: 'About', to: '#' },
  { label: 'Support', to: '#' },
];

export default function Navbar({ searchGames = [] }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-30 glass border-b border-white/5"
        id="main-nav"
      >
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-steam-accent via-steam-green-light to-steam-accent" />
        
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo + Nav Links */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2.5 text-steam-text-bright hover:text-steam-accent transition-all duration-300 group"
                id="steam-logo"
              >
                <FaSteam className="text-2xl group-hover:rotate-[360deg] transition-transform duration-700" />
                <span className="text-lg font-bold tracking-widest hidden sm:inline">STEAM</span>
              </Link>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-0.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="relative px-3 py-1.5 text-sm font-medium text-steam-text hover:text-steam-text-bright transition-all duration-200 rounded group"
                  >
                    {link.label}
                    {/* Hover underline effect */}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-steam-accent transition-all duration-300 rounded-full" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side: search, user, cart */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <SearchBar games={searchGames} />
              </div>

              <button
                className="p-2 text-steam-text hover:text-steam-accent transition-all duration-200 hover:scale-110"
                aria-label="User profile"
                id="user-icon"
              >
                <FaUser className="text-base" />
              </button>
              <CartIcon onClick={() => setCartOpen(true)} />

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-steam-text hover:text-steam-accent transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                id="mobile-menu-btn"
              >
                {mobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 pt-2 border-t border-white/5 space-y-2 animate-fade-in-up">
              <div className="sm:hidden pb-1">
                <SearchBar games={searchGames} />
              </div>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block px-3 py-2.5 text-sm text-steam-text hover:text-steam-text-bright hover:bg-white/5 rounded transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <CartPanel isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
