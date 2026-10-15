import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle2, AlertCircle, Store, Sparkles } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api, ApiError } from '../services/api';

const STATUS_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready for Pickup',
  'Completed',
];

export const OrderTracker: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [referenceInput, setReferenceInput] = useState(initialRef);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (ref: string) => {
    if (!ref.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrderByReference(ref);
      setOrder(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Could not connect to order tracking service.');
      }
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchOrder(initialRef);
    }
  }, [initialRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceInput.trim()) return;
    setSearchParams({ ref: referenceInput.trim() });
    fetchOrder(referenceInput);
  };

  const getStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-transparent text-[#F7EFE9]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-md mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F47A28] bg-[#1C120B]/90 px-3 py-1 rounded-full border border-[#F47A28]/40 shadow-xs rgb-frame">
            <Sparkles className="w-3 h-3" />
            <span>Real-Time Barista Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFDF8]">
            Track Your Pickup
          </h1>
          <p className="text-xs sm:text-sm text-[#A39082]">
            Enter your order reference code (e.g. CM-894102) to track the real-time barista status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A39082]" />
            <input
              type="text"
              required
              placeholder="e.g. CM-894102"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2.5 bg-[#17100B] border border-[#3E2818] rounded-xl text-sm font-mono uppercase text-[#FFFDF8] placeholder:text-[#A39082]/50 focus:outline-hidden focus:ring-2 focus:ring-[#F47A28]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white text-xs font-semibold rounded-xl shadow-md transition-colors shrink-0 disabled:opacity-50 cursor-pointer rgb-frame"
          >
            {loading ? 'Checking...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-center space-y-1 mb-8 max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400 mx-auto" />
            <div className="text-sm font-bold text-red-200">Order Not Found</div>
            <div className="text-xs text-red-300">{error}</div>
          </div>
        )}

        {order && (
          <div className="bg-[#17100B]/90 backdrop-blur-md rounded-2xl border border-[#3E2818] p-6 sm:p-8 shadow-2xl rgb-frame rgb-glow space-y-8 animate-in fade-in duration-300">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3E2818]">
              <div>
                <span className="text-[11px] font-bold text-[#A39082] uppercase tracking-wider">
                  Order Reference
                </span>
                <div className="text-2xl font-extrabold font-mono text-[#F47A28]">
                  {order.reference}
                </div>
                <div className="text-xs text-[#A39082] mt-0.5">
                  Ordered by {order.customerName}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-[#A39082] uppercase tracking-wider">
                  Current Status
                </span>
                <div className="text-base font-bold text-[#00e676] flex items-center gap-2 justify-end">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] animate-pulse" />
                  <span>{order.status}</span>
                </div>
              </div>
            </div>

            {/* Stepper */}
            {order.status === 'Cancelled' ? (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-center text-sm font-semibold">
                This order was cancelled. Please speak to our baristas or contact us for assistance.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-[#281A10] -translate-y-1/2 z-0" />
                  <div
                    className="hidden sm:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#D95E14] to-[#F47A28] -translate-y-1/2 z-0 transition-all duration-500"
                    style={{
                      width: `${(Math.max(0, getStepIndex(order.status)) / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />

                  {/* Step circles */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {STATUS_STEPS.map((step, idx) => {
                      const currentIdx = getStepIndex(order.status);
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step}
                          className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center"
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isComplete
                                ? 'bg-gradient-to-r from-[#D95E14] to-[#F47A28] text-white shadow-md'
                                : 'bg-[#140E0A] border-2 border-[#3E2818] text-[#A39082]'
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span
                            className={`text-xs ${
                              isCurrent
                                ? 'font-bold text-[#F47A28]'
                                : isComplete
                                ? 'font-semibold text-[#FFFDF8]'
                                : 'text-[#A39082]'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Store pickup details */}
            <div className="p-4 rounded-xl bg-[#120B07] border border-[#3E2818] flex items-start gap-3">
              <Store className="w-5 h-5 text-[#F47A28] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-[#FFFDF8]">Pick up at counter:</span>{' '}
                <span className="text-[#C5B5A5]">
                  Purok 3, San Francisco, Talibon, Bohol. Please present order reference #{order.reference} when paying and claiming.
                </span>
              </div>
            </div>

            {/* Itemized summary */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A39082]">
                Order Items
              </h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="text-[#FFFDF8]">
                      <span className="font-semibold text-[#F47A28]">{item.quantity}×</span> {item.productName}
                    </div>
                    <div className="font-mono tabular-nums text-[#FFFDF8] font-bold">
                      ₱{item.subtotal}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#3E2818] flex justify-between items-center text-sm font-extrabold text-[#FFFDF8]">
                <span>Total Amount Due</span>
                <span className="text-[#F47A28] font-mono tabular-nums text-lg">
                  ₱{order.total}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
