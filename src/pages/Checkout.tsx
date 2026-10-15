import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, ShoppingBag, Loader2, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api, ApiError } from '../services/api';

export const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If cart is empty, show empty notice
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-transparent text-[#F7EFE9]">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1C120B] border border-[#3E2818] text-[#F47A28] mx-auto flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-[#FFFDF8]">Your cart is empty</h2>
          <p className="text-sm text-[#A39082]">
            Please select at least one drink or pastry from our menu before proceeding to checkout.
          </p>
          <div>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white text-xs font-semibold rounded-xl shadow-md transition-colors rgb-frame"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    // Philippine phone check (e.g., 0917 123 4567 or +63917 123 4567)
    const cleanPhone = customerPhone.replace(/[\s-]/g, '');
    const phPhoneRegex = /^(09|\+639|9)\d{9}$/;
    if (!phPhoneRegex.test(cleanPhone)) {
      setErrorMessage(
        'Please enter a valid Philippine mobile number (e.g., 0917 123 4567 or +63 917 123 4567).'
      );
      return;
    }

    if (customerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail.trim())) {
        setErrorMessage('Please provide a valid email address.');
        return;
      }
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        notes: notes.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await api.createOrder(orderPayload);

      // Clear cart strictly after backend confirmation
      clearCart();

      // Navigate to confirmation page
      navigate(`/order-confirmation/${order.reference}`, {
        state: { order },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected network error occurred while submitting your order. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-transparent text-[#F7EFE9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#A39082] hover:text-[#FFFDF8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#FFFDF8]">
            Order Checkout
          </h1>
          <p className="text-sm text-[#C5B5A5] mt-1">
            Pick up fresh at Coffee Mellenia in Purok 3, San Francisco, Talibon, Bohol within 10–15 minutes of ordering.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/70 border border-red-500/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">{errorMessage}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Customer Details Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pickup location banner */}
              <div className="p-4 rounded-xl bg-[#1A110B]/90 border border-[#3E2818] flex items-start gap-3.5 cool-animated-border shadow-md">
                <div className="p-2 rounded-lg bg-[#2A160A] text-[#F47A28] border border-[#F47A28]/30 mt-0.5">
                  <Store className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-[#FFFDF8]">
                    Pickup Only Order
                  </div>
                  <div className="text-[#A39082] mt-0.5">
                    Coffee Mellenia · Purok 3, San Francisco, Talibon, Bohol
                  </div>
                  <div className="text-[#F47A28] font-semibold mt-1">
                    Ready for pickup in ~15 mins after confirmation
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="bg-[#17100B]/90 backdrop-blur-md p-6 rounded-2xl border border-[#3E2818] shadow-xl rgb-frame rgb-glow space-y-4">
                <h3 className="text-base font-bold text-[#FFFDF8]">
                  Customer Information
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-sm text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                    Philippine Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0917 123 4567 or +63 917 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-sm text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                  />
                  <p className="text-[11px] text-[#A39082] mt-1">
                    We will text your order status updates to this number.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                    Email Address <span className="text-[#A39082] font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="maria.santos@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-sm text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFE4C6] uppercase tracking-wider mb-1">
                    Preparation Notes / Special Requests <span className="text-[#A39082] font-normal lowercase">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Less ice for Spanish latte, warm the croissant"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#120B07] border border-[#3E2818] rounded-xl text-sm text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#17100B]/90 backdrop-blur-md p-6 rounded-2xl border border-[#3E2818] shadow-md space-y-3 rgb-frame">
                <h3 className="text-base font-bold text-[#FFFDF8]">
                  Payment Method
                </h3>
                <div className="p-3.5 rounded-xl border border-[#F47A28] bg-[#22130A] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border-4 border-[#F47A28] bg-white shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#FFFDF8]">
                        Pay at Café Pickup
                      </div>
                      <div className="text-[11px] text-[#A39082]">
                        Cash, GCash, Maya, or Credit/Debit Card at the counter
                      </div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-[#F47A28]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] disabled:opacity-60 text-white font-bold rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#F47A28] rgb-frame rgb-glow"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying & Placing Order...</span>
                  </>
                ) : (
                  <span>Place Pickup Order (₱{totalPrice})</span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-[#17100B]/90 backdrop-blur-md p-6 rounded-2xl border border-[#3E2818] shadow-xl rgb-frame rgb-glow space-y-5 sticky top-28">
              <h3 className="text-base font-bold text-[#FFFDF8] pb-3 border-b border-[#3E2818]">
                Order Summary
              </h3>

              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 rgb-image-frame bg-[#140E0A]">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#FFFDF8] truncate">
                          {item.product.name}
                        </div>
                        <div className="text-[#A39082] font-mono tabular-nums">
                          Qty: {item.quantity} × ₱{item.product.price}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-[#F47A28] font-mono tabular-nums shrink-0">
                      ₱{item.product.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#3E2818] space-y-2 text-xs">
                <div className="flex justify-between text-[#A39082]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#FFFDF8]">₱{totalPrice}</span>
                </div>
                <div className="flex justify-between text-[#A39082]">
                  <span>Estimated Tax</span>
                  <span className="text-[#FFFDF8]">Included</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#FFFDF8] pt-3 border-t border-[#3E2818]">
                  <span>Total Amount</span>
                  <span className="text-[#F47A28] font-mono tabular-nums text-lg">
                    ₱{totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
