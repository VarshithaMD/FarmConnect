import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  RotateCw,
  FileText,
  MapPin,
  ChevronRight,
  User as UserIcon,
  X,
  CreditCard,
  Sprout
} from 'lucide-react';
import { User, Order, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CustomerDashboardProps {
  user: User;
  orders: Order[];
  recommendedProducts: Product[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onViewProductDetails: (product: Product) => void;
  onNavigateMarketplace: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  orders,
  recommendedProducts,
  onAddToCart,
  onViewProductDetails,
  onNavigateMarketplace,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'recommended' | 'profile'>('orders');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed' || o.orderStatus === 'packed' || o.orderStatus === 'in_transit'
  ).length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const totalSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'packed':
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getStatusStepIndex = (status: Order['orderStatus']) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'packed': return 3;
      case 'in_transit': return 4;
      case 'delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#1B5E20] to-emerald-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <UserIcon className="w-4 h-4 text-emerald-400" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Welcome back, {user.name}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-200">
            Supporting regional farming families from {user.city || 'Pune'}, {user.state || 'Maharashtra'}.
          </p>
        </div>

        <button
          onClick={onNavigateMarketplace}
          className="self-start md:self-auto px-5 py-3 bg-[#F4C542] hover:bg-[#e0b539] text-stone-900 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Today’s Harvest</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Total Orders
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tabular-nums">
              {totalOrdersCount}
            </span>
            <span className="text-xs text-stone-400">placed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            In Delivery / Pending
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono tabular-nums">
              {pendingOrdersCount}
            </span>
            <span className="text-xs text-stone-400">active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Completed Orders
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#1B5E20] font-mono tabular-nums">
              {completedOrdersCount}
            </span>
            <span className="text-xs text-stone-400">received</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Direct Farm Support
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tabular-nums">
              ₹{totalSpent}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">100% fair</span>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Order History ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'recommended'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Recommended Fresh ({recommendedProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'profile'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Delivery Address & Profile
        </button>
      </div>

      {/* TAB 1: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Browse our marketplace of farm-fresh vegetables, grains, and fruits to place your first direct order.
              </p>
              <button
                onClick={onNavigateMarketplace}
                className="px-5 py-2.5 bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl text-xs font-bold transition-colors"
              >
                Explore Marketplace
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const stepIdx = getStatusStepIndex(order.orderStatus);
              return (
                <div
                  key={order.id}
                  className="rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-xs space-y-4 p-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-black text-stone-900">
                        {order.id}
                      </span>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="font-bold text-[#1B5E20] font-mono tabular-nums text-sm">
                        ₹{order.totalAmount}
                      </span>
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="text-stone-700 hover:text-[#1B5E20] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Tracking Status Pipeline */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 text-center text-[11px] font-medium text-stone-600 gap-2 mb-2">
                      <span className={stepIdx >= 2 ? 'text-emerald-800 font-bold' : ''}>1. Confirmed</span>
                      <span className={stepIdx >= 3 ? 'text-emerald-800 font-bold' : ''}>2. Packed at Farm</span>
                      <span className={stepIdx >= 4 ? 'text-emerald-800 font-bold' : ''}>3. Direct Transit</span>
                      <span className={stepIdx >= 5 ? 'text-emerald-800 font-bold' : ''}>4. Delivered</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#1B5E20] h-full transition-all duration-500"
                        style={{ width: `${(stepIdx / 4) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3 pt-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover bg-stone-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-stone-900">{item.productName}</h4>
                            <p className="text-[11px] text-stone-500">
                              By Farmer: {item.farmerName} · {item.quantity} {item.unit}
                            </p>
                          </div>
                        </div>

                        <span className="font-bold font-mono tabular-nums text-stone-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Meta & Action */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-stone-500">
                      <span>Delivery To: {order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                      <span className="mx-2">·</span>
                      <span>Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Verified'}</span>
                    </div>

                    <button
                      onClick={() => {
                        // Re-add first product to cart
                        const firstItem = order.items[0];
                        if (firstItem) {
                          const prod = recommendedProducts.find((p) => p.id === firstItem.productId);
                          if (prod) onAddToCart(prod, 1);
                        }
                      }}
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-stone-500" />
                      <span>Order Again</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: Recommended Products */}
      {activeTab === 'recommended' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-stone-900">Recommended for Your Kitchen</h3>
              <p className="text-xs text-stone-500">Seasonal harvests fresh from nearby Maharashtra and Himachal orchards.</p>
            </div>
            <button
              onClick={onNavigateMarketplace}
              className="text-xs font-bold text-[#1B5E20] hover:underline"
            >
              Browse All →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={onAddToCart}
                onViewDetails={onViewProductDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Delivery Address & Profile */}
      {activeTab === 'profile' && (
        <div className="p-8 rounded-3xl bg-white border border-stone-200 space-y-6 max-w-2xl">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{user.name}</h3>
              <p className="text-xs text-stone-500">{user.email} · {user.phone}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1B5E20]" />
              <span>Registered Delivery Location</span>
            </h4>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Street Address:</span>
                <span className="font-semibold text-stone-800">{user.address || 'Civil Lines'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">City / State:</span>
                <span className="font-semibold text-stone-800">{user.city}, {user.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Postal Code:</span>
                <span className="font-mono tabular-nums font-semibold text-stone-800">{user.pincode}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-stone-700 space-y-1">
              <span className="font-bold text-emerald-950 block">Direct Delivery Coverage</span>
              <p className="text-[11px] leading-relaxed">
                Your delivery address receives morning dispatch batches directly from Nashik, Pune rural, and Himachal mountain partner cooperatives.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#1B5E20] text-white flex items-center justify-center font-bold text-sm">
                  F
                </span>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-display">FarmConnect Tax Invoice</h3>
                  <p className="text-[10px] text-stone-500">Direct Farmer Receipt #{selectedInvoiceOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-4">
              <div className="flex justify-between text-stone-600">
                <div>
                  <span className="font-bold text-stone-900 block">Billed To:</span>
                  <span>{selectedInvoiceOrder.customerName}</span>
                  <p>{selectedInvoiceOrder.deliveryAddress.street}, {selectedInvoiceOrder.deliveryAddress.city}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900 block">Date:</span>
                  <span>{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</span>
                  <p className="text-emerald-800 font-bold">{selectedInvoiceOrder.paymentStatus.toUpperCase()}</p>
                </div>
              </div>

              {/* Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                    <tr>
                      <th className="p-2.5">Produce Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedInvoiceOrder.items.map((it, i) => (
                      <tr key={i}>
                        <td className="p-2.5 font-medium">{it.productName}</td>
                        <td className="p-2.5 text-center font-mono tabular-nums">{it.quantity} {it.unit}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums">₹{it.price}</td>
                        <td className="p-2.5 text-right font-mono tabular-nums font-bold">₹{it.price * it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1.5 pt-2 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">₹{selectedInvoiceOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Direct Delivery Fee:</span>
                  <span className="font-mono tabular-nums">₹{selectedInvoiceOrder.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                  <span>Final Total Paid:</span>
                  <span className="text-[#1B5E20] font-mono tabular-nums">₹{selectedInvoiceOrder.totalAmount}</span>
                </div>
              </div>

              <p className="text-[10px] text-stone-400 text-center pt-2">
                Thank you for eliminating middlemen and supporting rural Indian farmers directly.
              </p>
            </div>

            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="w-full py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
