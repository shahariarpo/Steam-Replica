import { FaTimes, FaTrash } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';

export default function CartPanel({ isOpen, onClose }) {
  const { items, removeFromCart, clearCart, cartTotal } = useCart();

  const formatPrice = (cents) => {
    if (!cents || cents === 0) return 'Free';
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-steam-darkest border-l border-steam-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="cart-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-steam-border">
          <h2 className="text-lg font-semibold text-steam-text-bright">
            Your Cart ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-steam-text-dim hover:text-steam-text-bright transition-colors"
            aria-label="Close cart"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          {items.length === 0 ? (
            <div className="text-center text-steam-text-dim py-12">
              <p className="text-base mb-1">Your cart is empty</p>
              <p className="text-sm">Browse the store and add some games!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-steam-card-bg rounded-lg p-3 group hover:bg-steam-card-hover transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-7.5 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-steam-text-bright truncate">{item.name}</div>
                  <div className="text-sm mt-0.5">
                    {item.discountPercent > 0 && (
                      <>
                        <span className="text-steam-green-light font-semibold mr-1">-{item.discountPercent}%</span>
                        <span className="price-strike text-xs mr-1">{formatPrice(item.originalPrice)}</span>
                      </>
                    )}
                    <span className="text-steam-text-bright">{formatPrice(item.finalPrice)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-steam-text-dim hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${item.name}`}
                >
                  <FaTrash className="text-sm" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-steam-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-steam-text-dim text-sm">Estimated total</span>
              <span className="text-lg font-bold text-steam-text-bright">{formatPrice(cartTotal)}</span>
            </div>
            <button
              className="w-full py-2.5 bg-steam-green hover:bg-steam-green-light text-steam-text-bright hover:text-steam-darkest font-semibold rounded transition-all duration-200 text-sm"
              id="checkout-btn"
            >
              Purchase for myself
            </button>
            <button
              onClick={clearCart}
              className="w-full py-1.5 text-steam-text-dim hover:text-red-400 text-xs transition-colors"
            >
              Remove all items
            </button>
          </div>
        )}
      </div>
    </>
  );
}
