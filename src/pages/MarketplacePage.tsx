import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, ShieldCheck, MapPin, Check } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';

interface MarketplacePageProps {
  products: Product[];
  initialCategory?: ProductCategory | 'All';
  onAddToCart: (product: Product, quantity?: number) => void;
  onViewProductDetails: (product: Product) => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  products,
  initialCategory = 'All',
  onAddToCart,
  onViewProductDetails,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(initialCategory);
  const [priceRange, setPriceRange] = useState<number>(500);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Dairy',
    'Organic Produce',
  ];

  const locations = useMemo(() => {
    const locSet = new Set<string>();
    products.forEach((p) => {
      const city = p.farmLocation.split(',')[1]?.trim() || p.farmLocation.split(',')[0]?.trim();
      if (city) locSet.add(city);
    });
    return ['All', ...Array.from(locSet)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchFarmer = p.farmerName.toLowerCase().includes(q);
        const matchLocation = p.farmLocation.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        if (!matchName && !matchFarmer && !matchLocation && !matchDesc) return false;
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Price
      if (p.price > priceRange) {
        return false;
      }

      // Organic
      if (organicOnly && !p.isOrganic) {
        return false;
      }

      // Location
      if (selectedLocation !== 'All' && !p.farmLocation.includes(selectedLocation)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
      return 0; // featured default
    });
  }, [products, search, selectedCategory, priceRange, organicOnly, selectedLocation, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setPriceRange(500);
    setOrganicOnly(false);
    setSelectedLocation('All');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Search Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900 font-display">
              Direct Farm Produce Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Browse freshly harvested items directly from verified regional growers with full origin transparency.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search produce, farmer, or city..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Functional Buttons per Frontend Constitution) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#1B5E20] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block space-y-6 p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1B5E20]" />
              <span>Refine Produce</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-stone-500 hover:text-[#1B5E20] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Max Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-stone-700">Max Price:</span>
              <span className="font-mono tabular-nums font-bold text-[#1B5E20]">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="40"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#1B5E20] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>₹40</span>
              <span>₹500</span>
            </div>
          </div>

          {/* Location / Region Filter */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <label className="block text-xs font-semibold text-stone-700">Farm Region</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Farm Regions' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Organic Verification Toggle */}
          <div className="pt-3 border-t border-stone-100">
            <label
              onClick={() => setOrganicOnly(!organicOnly)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4CAF50]" />
                <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900">
                  Organic Certified Only
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  organicOnly ? 'bg-[#1B5E20] border-[#1B5E20] text-white' : 'border-stone-300 bg-white'
                }`}
              >
                {organicOnly && <Check className="w-3.5 h-3.5" />}
              </div>
            </label>
          </div>

          {/* Zero Middlemen Guarantee Note */}
          <div className="p-3.5 rounded-2xl bg-[#FAFAF5] border border-stone-200/60 text-xs text-stone-600 space-y-1">
            <span className="font-bold text-[#1B5E20] block">Direct Traceability</span>
            <p className="text-[11px] leading-relaxed">
              Every crop listed here is harvested by the named farmer. GPS coordinates are available on each item card.
            </p>
          </div>
        </aside>

        {/* Product Grid & Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200/80 text-xs">
            <span className="text-stone-500 font-medium">
              Showing <strong className="text-stone-900 font-mono tabular-nums">{filteredProducts.length}</strong> items available
            </span>

            <div className="flex items-center gap-3">
              <span className="text-stone-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1.5 rounded-lg border border-stone-200 bg-stone-50 font-semibold text-stone-800 focus:outline-hidden"
              >
                <option value="featured">Featured Fresh</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid of Product Cards */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewProductDetails}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-800">No produce matches your filters</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range, clearing your search query, or unchecking the organic filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
