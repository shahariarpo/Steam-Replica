import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);
const CartDispatchContext = createContext(null);

const STORAGE_KEY = 'steam-replica-cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function cartReducer(items, action) {
  switch (action.type) {
    case 'ADD': {
      if (items.find((item) => item.id === action.game.id)) return items;
      return [...items, action.game];
    }
    case 'REMOVE':
      return items.filter((item) => item.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, null, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  return (
    <CartContext.Provider value={items}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}

export function useCartItems() {
  return useContext(CartContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}
