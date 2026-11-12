import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = 500;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1B5E20]" />
            <h2 className="text-base font-bold text-stone-900 font-display">Your Harvest Basket</h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full tabular-nums">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-900 flex items-center justify-between">
          {isFreeDelivery ? (
            <span className="font-semibold text-emerald-800">You unlocked Free Direct Farm Delivery!</span>
          ) : (
            <span>
              Add <strong className="font-mono tabular-nums">₹{freeDeliveryThreshold - subtotal}</strong> more for <strong>Free Delivery</strong>
            </span>
          )}
          <span className="font-mono tabular-nums font-bold text-[11px] text-emerald-700">
            {Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%
          </span>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-stone-800">Your basket is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Explore directly harvested vegetables, orchard fruits, stone-ground flours, and raw honey.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 text-xs font-semibold bg-[#1B5E20] text-white rounded-xl hover:bg-[#164d1a] transition-colors"
              >
                Browse Fresh Marketplace
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200 bg-white shadow-2xs hover:border-stone-300 transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">{product.name}</h4>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    Farmer: {product.farmerName} · {product.farmName.split(' ')[0]}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs font-bold text-[#1B5E20] font-mono tabular-nums">
                      ₹{product.price * quantity}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      (₹{product.price}/{product.unit})
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-stone-800 font-mono tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/90 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Direct Delivery</span>
                <span className="font-mono tabular-nums font-semibold">
                  {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-[#1B5E20] font-mono tabular-nums text-base">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
