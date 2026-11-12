import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Banknote, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { CartItem, User, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: User | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  user,
  onOrderSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'razorpay_demo' | 'cod'>('razorpay_demo');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);

  // Delivery details form
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address || '',
    city: user?.city || 'Pune',
    state: user?.state || 'Maharashtra',
    pincode: user?.pincode || '411045',
  });

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create backend order
      const orderPayload = {
        items: items.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.image,
          price: i.product.price,
          unit: i.product.unit,
          quantity: i.quantity,
          farmerId: i.product.farmerId,
          farmerName: i.product.farmerName,
        })),
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        paymentMethod,
        subtotal,
        deliveryFee,
        totalAmount: total,
        phone: formData.phone,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('farmconnect_token') || ''}` } : {})
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      setSuccessOrder(data.order);
      onOrderSuccess(data.order);
    } catch (err: any) {
      alert(err.message || 'Error processing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900 font-display">
              {successOrder ? 'Order Confirmed!' : 'Checkout & Farm Delivery'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {successOrder ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#1B5E20] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Order #{successOrder.id}
              </span>
              <h3 className="text-2xl font-black text-stone-900 font-display">Harvest Is Booked!</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Your order was successfully sent to the local farmers. They will pick your produce at dawn and dispatch it directly to your address.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Delivery:</span>
                <span className="font-bold text-stone-900">{successOrder.deliveryDateEstimate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Destination:</span>
                <span className="font-semibold text-stone-800">{successOrder.deliveryAddress.city}, {successOrder.deliveryAddress.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment:</span>
                <span className="font-semibold text-stone-800">
                  {successOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Pending)' : 'Razorpay Verified (Paid)'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                <span>Total Amount:</span>
                <span className="text-[#1B5E20] font-mono tabular-nums">₹{successOrder.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Continue to Marketplace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Delivery Address Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#1B5E20]" />
                <span>Delivery Address</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                    placeholder="e.g. Priya Sharma"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-600 font-medium mb-1">Street Address / House No.</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                    placeholder="Apartment, Street name, Landmark"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1B5E20]" />
                <span>Select Payment Method</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setPaymentMethod('razorpay_demo')}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                    paymentMethod === 'razorpay_demo'
                      ? 'border-[#1B5E20] bg-emerald-50/50'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'razorpay_demo'}
                    onChange={() => setPaymentMethod('razorpay_demo')}
                    className="mt-1 text-[#1B5E20] focus:ring-[#1B5E20]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                      <CreditCard className="w-4 h-4 text-[#1B5E20]" />
                      <span>Razorpay Online (Test Mode)</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Instant simulated UPI, Card, NetBanking with zero gateway fees
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#1B5E20] bg-emerald-50/50'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#1B5E20] focus:ring-[#1B5E20]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Pay cash or UPI directly to the delivery person upon inspection
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Total Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Produce Subtotal ({items.length} items)</span>
                <span className="font-mono tabular-nums font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Direct Delivery</span>
                <span className="font-mono tabular-nums font-semibold">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                <span>Total Payable</span>
                <span className="text-[#1B5E20] font-mono tabular-nums text-base">₹{total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-98"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>Confirm & Place Order · ₹{total}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
