import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';

export default function CartIcon({ onClick }) {
  const { cartCount } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-steam-text hover:text-steam-accent transition-colors"
      aria-label={`Shopping cart with ${cartCount} items`}
      id="cart-icon"
    >
      <FaShoppingCart className="text-lg" />
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-steam-green-light text-steam-darkest text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
          {cartCount}
        </span>
      )}
    </button>
  );
}
