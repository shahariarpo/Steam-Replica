import { BrowserRouter, Routes, Route } from 'react-router';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StorePage from './pages/StorePage';
import GameDetailPage from './pages/GameDetailPage';
import { ALL_GAMES } from './data/gamesData';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-steam-dark">
          <Navbar searchGames={ALL_GAMES} />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<StorePage />} />
              <Route path="/app/:appId" element={<GameDetailPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
