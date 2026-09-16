import { useCartItems, useCartDispatch } from '../context/CartContext';

export function useCart() {
  const items = useCartItems();
  const dispatch = useCartDispatch();

  const addToCart = (game) => {
    dispatch({
      type: 'ADD',
      game: {
        id: game.id,
        name: game.name,
        image: game.header_image || game.small_capsule_image || '',
        originalPrice: game.original_price,
        finalPrice: game.final_price,
        discountPercent: game.discount_percent || 0,
        currency: game.currency || 'USD',
      },
    });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE', id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  const isInCart = (id) => {
    return items.some((item) => item.id === id);
  };

  const cartCount = items.length;

  const cartTotal = items.reduce((sum, item) => sum + (item.finalPrice || 0), 0);

  return { items, addToCart, removeFromCart, clearCart, isInCart, cartCount, cartTotal };
}
