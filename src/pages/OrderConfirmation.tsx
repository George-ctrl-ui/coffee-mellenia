import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, ArrowRight, Printer, Store, Phone, Sparkles } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const OrderConfirmation: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(
    (location.state as { order?: Order })?.order || null
  );
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order && reference) {
      api
        .getOrderByReference(reference)
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Could not find order.');
          setLoading(false);
        });
    }
  }, [order, reference]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-transparent text-[#F7EFE9] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#F47A28] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#A39082]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-transparent text-[#F7EFE9]">
        <div className="max-w-md mx-auto text-center space-y-4 px-4">
          <h2 className="text-2xl font-bold text-[#FFFDF8]">Order Not Found</h2>
          <p className="text-sm text-[#A39082]">
            {error || 'Unable to retrieve your order details.'}
          </p>
          <Link
            to="/menu"
            className="inline-flex px-6 py-2.5 bg-gradient-to-r from-[#D95E14] to-[#F47A28] text-white text-xs font-semibold rounded-xl"
          >
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 bg-transparent text-[#F7EFE9]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Celebration Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F47A28] bg-[#1C120B]/90 px-3 py-1 rounded-full border border-[#F47A28]/40 shadow-xs rgb-frame">
            <Sparkles className="w-3 h-3" />
            <span>Order Confirmed</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#FFFDF8]">
            Thank You, {order.customerName.split(' ')[0]}!
          </h1>

          <p className="text-sm text-[#C5B5A5] max-w-md mx-auto">
            Your coffee order has been submitted to the baristas at Coffee Mellenia in Purok 3, San Francisco, Talibon, Bohol.
          </p>
        </div>

        {/* Order Details Card with RGB Frame */}
        <div className="bg-[#17100B]/90 backdrop-blur-md rounded-2xl border border-[#3E2818] p-6 shadow-2xl rgb-frame rgb-glow space-y-6">
          {/* Reference Banner */}
          <div className="p-4 rounded-xl bg-[#22130A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#F47A28]/30">
            <div>
              <div className="text-[11px] font-bold text-[#A39082] uppercase tracking-wider">
                Order Reference
              </div>
              <div className="text-2xl font-extrabold font-mono tracking-wide text-[#F47A28]">
                {order.reference}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFFDF8]">
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Pickup Instructions */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A39082]">
              Pickup Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Store className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFFDF8]">Coffee Mellenia</div>
                  <div className="text-[#A39082]">Purok 3, San Francisco, Talibon, Bohol</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFFDF8]">Estimated Preparation</div>
                  <div className="text-[#A39082]">10–15 Minutes</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFFDF8]">Contact Phone</div>
                  <div className="text-[#A39082]">{order.customerPhone}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F47A28] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#FFFDF8]">Payment</div>
                  <div className="text-[#A39082]">Pay at Pickup (Cash / E-Wallet / Card)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Receipt */}
          <div className="pt-4 border-t border-[#3E2818] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#A39082]">
              Items Ordered
            </h3>
            <div className="space-y-2.5">
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

            {order.notes && (
              <div className="p-3 rounded-lg bg-[#120B07] border border-[#3E2818] text-xs text-[#A39082]">
                <span className="font-semibold text-[#FFE4C6]">Notes: </span>
                {order.notes}
              </div>
            )}

            <div className="pt-3 border-t border-[#3E2818] flex justify-between items-center text-base font-extrabold text-[#FFFDF8]">
              <span>Total Payable</span>
              <span className="text-[#F47A28] font-mono tabular-nums text-xl">
                ₱{order.total}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#3E2818]">
            <Link
              to={`/track?ref=${order.reference}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-[#D95E14] to-[#F47A28] hover:from-[#F47A28] hover:to-[#FFA05A] text-white text-xs font-semibold rounded-xl shadow-lg transition-all active:scale-98 rgb-frame"
            >
              <span>Track Live Order Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#25170F] hover:bg-[#321E14] text-[#FFE4C6] border border-[#3E2818] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
