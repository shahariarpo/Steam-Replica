import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { CartProvider } from './context/CartContext';
import { AdultFilterProvider } from './context/AdultFilterContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StorePage from './pages/StorePage';
import GameDetailPage from './pages/GameDetailPage';

export default function App() {
  const [searchGames, setSearchGames] = useState([]);

  const handleSearchGamesReady = useCallback((games) => {
    setSearchGames(games);
  }, []);

  return (
    <BrowserRouter>
      <AdultFilterProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-steam-dark">
            <Navbar searchGames={searchGames} />
            <div className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={<StorePage onSearchGamesReady={handleSearchGamesReady} />}
                />
                <Route path="/app/:appId" element={<GameDetailPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AdultFilterProvider>
    </BrowserRouter>
  );
}
