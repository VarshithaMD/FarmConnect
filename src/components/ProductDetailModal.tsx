import React, { useState } from 'react';
import { X, Star, ShieldCheck, MapPin, Truck, Sprout, ShoppingBag, Send, Award, HeartHandshake } from 'lucide-react';
import { Product, Review, User } from '../types';
import { FarmMap } from './FarmMap';

interface ProductDetailModalProps {
  product: Product | null;
  farmer: User | null;
  reviews: Review[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSubmitReview: (productId: string, rating: number, comment: string) => Promise<void>;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  farmer,
  reviews,
  onClose,
  onAddToCart,
  onSubmitReview,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!product) return null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      await onSubmitReview(product.id, newRating, newComment);
      setNewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-emerald-800 font-semibold">{product.category}</span>
            <span>/</span>
            <span className="text-stone-800 truncate max-w-[200px]">{product.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Main 2-Column Split: Visuals & Contiguous Purchase Module */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Product Visual & Farm Identity */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>{product.harvestDate}</span>
                </div>
                {product.isOrganic && (
                  <div className="absolute top-3 right-3 bg-[#1B5E20] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#F4C542]" />
                    <span>Certified Organic</span>
                  </div>
                )}
              </div>

              {/* Farmer Micro Profile Box */}
              <div className="p-4 rounded-2xl bg-[#FAFAF5] border border-stone-200/80 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1B5E20] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                  {product.farmerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-stone-900">{product.farmerName}</h4>
                    <span className="text-[11px] text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md font-medium">
                      Verified Producer
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 font-medium">{product.farmName}</p>
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{product.farmLocation}</span>
                  </p>
                  {farmer?.farmBio && (
                    <p className="text-xs text-stone-600 mt-2 italic bg-white p-2.5 rounded-lg border border-stone-200/60">
                      "{farmer.farmBio}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="text-emerald-700 font-bold uppercase tracking-wider">{product.category}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-stone-800 font-mono tabular-nums">{product.rating}</span>
                    <span>({product.reviewsCount} verified reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl font-extrabold text-stone-900 mt-2 font-display leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 font-medium block">Direct Farmer Price</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-3xl font-black text-[#1B5E20] font-mono tabular-nums">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-stone-600 font-semibold">/ {product.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {product.stock > 0 ? `${product.stock} ${product.unit} available` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Harvest & Quality Notes</h4>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                    {product.description}
                  </p>
                </div>

                {/* Benefits List */}
                <div className="mt-4 space-y-2 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#4CAF50] shrink-0" />
                    <span>Dispatched in eco-crates directly from farm to home</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#4CAF50] shrink-0" />
                    <span>Zero chemical preservatives or synthetic waxes applied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-[#4CAF50] shrink-0" />
                    <span>100% price paid directly to the grower</span>
                  </div>
                </div>
              </div>

              {/* Purchase Action Box */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-600 hover:bg-white hover:text-stone-900 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-stone-900 font-mono tabular-nums text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-600 hover:bg-white hover:text-stone-900 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    disabled={product.stock === 0}
                    className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                      product.stock > 0
                        ? 'bg-[#1B5E20] hover:bg-[#164d1a] text-white active:scale-98'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} to Basket · ₹{product.price * quantity}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Farm Location Map Section */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1B5E20]" />
                  <span>Direct Farm Geolocation</span>
                </h3>
                <p className="text-xs text-stone-500">Know exactly where your food is grown, harvested, and packaged.</p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                GPS Verified
              </span>
            </div>
            <FarmMap farmer={farmer} heightClass="h-56" />
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Verified Consumer Reviews</h3>

            {/* Write Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-800">Rate this produce:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your taste, freshness, or packaging experience with this farm..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                required
              />

              <div className="flex items-center justify-between">
                {reviewSuccess ? (
                  <span className="text-xs text-emerald-700 font-semibold">Review submitted! Thank you.</span>
                ) : <span />}

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 text-xs font-semibold bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReview ? 'Posting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl border border-stone-100 bg-white shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{r.customerName}</span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Verified Buyer
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{r.comment}</p>
                    <span className="text-[10px] text-stone-400 mt-1 block">{r.date}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-500 italic">No reviews yet for this harvest. Be the first to share your experience!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
