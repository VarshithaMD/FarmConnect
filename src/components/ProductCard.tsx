import React from 'react';
import { ShoppingBag, Star, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Product Image Box */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // High-fidelity SVG gradient fallback
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add('bg-gradient-to-br', 'from-emerald-50', 'to-amber-50');
            }
          }}
        />

        {/* Harvest tag - quiet unboxed label with scrim */}
        <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>{product.harvestDate}</span>
        </div>

        {product.isOrganic && (
          <div className="absolute top-2.5 right-2.5 bg-[#1B5E20]/90 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#F4C542]" />
            <span>Organic</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category & Location unboxed */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium mb-1">
            <span className="uppercase tracking-wider text-emerald-800">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
              {product.farmLocation.split(',')[0]}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-sm font-bold text-stone-900 group-hover:text-[#1B5E20] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Farmer Attribution */}
          <p className="text-xs text-stone-600 mt-1 flex items-center gap-1">
            <span className="text-stone-400">By</span>
            <span className="font-semibold text-stone-800 truncate">{product.farmerName}</span>
            <span className="text-stone-400">({product.farmName.split(' ')[0]})</span>
          </p>
        </div>

        {/* Pricing, Rating & Add Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-[#1B5E20] font-mono tabular-nums">
                ₹{product.price}
              </span>
              <span className="text-xs text-stone-500 font-medium">/{product.unit}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-stone-800 font-mono tabular-nums">{product.rating}</span>
              <span>({product.reviewsCount})</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product, 1)}
            disabled={product.stock === 0}
            className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap shrink-0 ${
              product.stock > 0
                ? 'bg-[#1B5E20] hover:bg-[#164d1a] text-white'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock > 0 ? 'Add' : 'Sold Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
