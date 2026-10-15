import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleBrowseMenu = () => {
    setIsCartOpen(false);
    navigate('/menu');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-[#120B07] border-l border-[#3E2818] shadow-2xl flex flex-col text-[#F7EFE9]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#3E2818] flex items-center justify-between bg-[#17100B]">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-lg bg-[#2A160A] text-[#F47A28] border border-[#F47A28]/30">
                    <ShoppingBag className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-[#FFFDF8]">Your Order</h2>
                    <p className="text-xs text-[#A39082]">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full text-[#A39082] hover:text-[#FFFDF8] hover:bg-[#25170F] transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28]"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#1C120B] border border-[#3E2818] flex items-center justify-center text-[#F47A28] mb-4 shadow-lg">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h3 className="text-base font-bold text-[#FFFDF8] mb-1">
                      Your bag is empty
                    </h3>
                    <p className="text-sm text-[#A39082] max-w-xs mb-6">
                      Explore our handcrafted signature coffees, chilled brews, and fresh pastries.
                    </p>
                    <button
                      onClick={handleBrowseMenu}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-98 rgb-frame"
                    >
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4 p-3.5 rounded-xl border border-[#3E2818] bg-[#17100B]/90 hover:border-[#F47A28]/50 transition-colors rgb-frame shadow-md"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 rgb-image-frame bg-[#1E140E]">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-[#FFFDF8] truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#A39082] hover:text-red-400 transition-colors p-1"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-xs text-[#F47A28] mb-2 font-mono tabular-nums">
                          ₱{item.product.price} each
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-[#3E2818] rounded-md bg-[#100905]">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 text-[#A39082] hover:text-[#FFFDF8] disabled:opacity-30 disabled:hover:text-[#A39082] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold font-mono tabular-nums text-[#FFFDF8]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-[#A39082] hover:text-[#FFFDF8] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <span className="text-sm font-bold text-[#FFFDF8] font-mono tabular-nums">
                            ₱{item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer / Summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#3E2818] bg-[#17100B] space-y-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-[#A39082]">
                      <span>Order Type</span>
                      <span className="font-medium text-[#FFE4C6]">Café Pickup (Purok 3, Talibon)</span>
                    </div>
                    <div className="flex justify-between text-[#A39082]">
                      <span>Items Subtotal</span>
                      <span className="font-mono tabular-nums text-[#FFFDF8]">₱{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[#FFFDF8] pt-2 border-t border-[#3E2818]">
                      <span>Total Amount</span>
                      <span className="text-[#F47A28] font-mono tabular-nums text-lg">
                        ₱{totalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white font-semibold rounded-xl shadow-lg transition-all active:scale-98 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28] rgb-frame"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-2.5 text-xs font-semibold text-[#A39082] hover:text-[#FFFDF8] transition-colors text-center"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
