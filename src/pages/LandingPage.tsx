import React from 'react';
import {
  ArrowRight,
  Sprout,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Star,
  Users,
  Award,
  ChevronRight,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Product, ProductCategory, User } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FarmMap } from '../components/FarmMap';

interface LandingPageProps {
  products: Product[];
  farmers: User[];
  onNavigate: (view: string, filterCategory?: ProductCategory) => void;
  onOpenAuth: (mode?: 'login' | 'register', defaultRole?: 'customer' | 'farmer') => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onViewProductDetails: (product: Product) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  products,
  farmers,
  onNavigate,
  onOpenAuth,
  onAddToCart,
  onViewProductDetails,
}) => {
  const featuredProducts = products.slice(0, 4);

  const categories: { name: ProductCategory; icon: string; count: number; desc: string }[] = [
    { name: 'Vegetables', icon: '🥦', count: 18, desc: 'Heirloom tomatoes, crispy broccoli & greens' },
    { name: 'Fruits', icon: '🍎', count: 12, desc: 'High-altitude orchard apples & berries' },
    { name: 'Grains', icon: '🌾', count: 9, desc: 'Traditional unpolished rice & ancient khapli wheat' },
    { name: 'Pulses', icon: '🫘', count: 14, desc: 'Native desi chana, unpolished toor & moong' },
    { name: 'Dairy', icon: '🥛', count: 7, desc: 'Glass-bottled A2 farm milk & artisan paneer' },
    { name: 'Organic Produce', icon: '🍯', count: 11, desc: 'Wild multifloral honey & cold-pressed oils' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Farmers List Their Harvest',
      desc: 'Local growers list their freshly harvested crops, setting fair prices without intermediary markups or auction cuts.',
      icon: Sprout,
    },
    {
      step: '02',
      title: 'Customers Discover Fresh Produce',
      desc: 'Browse transparently by farm origin, harvest date, organic certification, and grower background in your region.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Customers Place Direct Orders',
      desc: 'Order directly with flexible payment methods including Razorpay test mode or Cash on Delivery after inspection.',
      icon: HeartHandshake,
    },
    {
      step: '04',
      title: 'Farmers Deliver Directly',
      desc: 'Harvested in the morning and dispatched within hours in temperature-controlled eco-crates right to your doorstep.',
      icon: Truck,
    },
  ];

  const testimonials = [
    {
      id: 1,
      quote: "The taste difference in tomatoes and carrots is astonishing. You can immediately tell they weren't sitting in a cold storage depot for 3 weeks.",
      name: "Ananya Deshmukh",
      role: "Home Cook & Parent",
      city: "Pune, Maharashtra",
      rating: 5,
    },
    {
      id: 2,
      quote: "As a small-acreage farmer, middleman commissions were eating 60% of my revenue. With FarmConnect, I get paid in full within 24 hours of delivery.",
      name: "Ramesh Patil",
      role: "Certified Organic Grower",
      city: "Nashik, Maharashtra",
      rating: 5,
    },
    {
      id: 3,
      quote: "Being able to see the exact GPS coordinates of the farm where my honey and orchard apples came from creates unmatched trust.",
      name: "Devendra Singhania",
      role: "Nutrition Specialist",
      city: "Mumbai, Maharashtra",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white min-h-[560px] flex items-center">
        {/* Background Image with Scrim Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_farm_landscape_1794483561808.jpg"
            alt="Lush agricultural farmland terraces at morning dawn"
            className="w-full h-full object-cover object-center filter brightness-65"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            {/* Value Marker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Direct Farmer-to-Consumer Agricultural Network</span>
            </div>

            {/* Main Headline (Exact requested copy) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1] text-balance">
              Fresh From Farms, Directly to Your Home.
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-stone-200 leading-relaxed text-balance">
              Eliminate predatory middlemen. Empower local agricultural families while enjoying crisp morning harvests, chemical-free fruits, and heritage grains delivered directly to your doorstep.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('marketplace')}
                className="px-6 py-3.5 bg-[#4CAF50] hover:bg-[#43a047] text-stone-950 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAuth('register', 'farmer')}
                className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Join as Farmer</span>
                <Sprout className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            {/* Trust Markers Strip */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-stone-300 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Middlemen Commission</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Direct Fair Compensation</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Traceable GPS Farm Origin</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1B5E20] font-mono tabular-nums">
                1,420+
              </span>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Registered Farmers</h4>
              <p className="text-xs text-stone-500">Across Maharashtra, Punjab & Himachal</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1B5E20] font-mono tabular-nums">
                48,500+ kg
              </span>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Produce Sold Direct</h4>
              <p className="text-xs text-stone-500">Picked fresh at dawn, zero cold stores</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1B5E20] font-mono tabular-nums">
                0%
              </span>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Middlemen Cut</h4>
              <p className="text-xs text-stone-500">100% of product price goes to growers</p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#1B5E20] font-mono tabular-nums">
                98.7%
              </span>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Customer Satisfaction</h4>
              <p className="text-xs text-stone-500">Based on 2,800+ consumer ratings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Seasonal & Fresh
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
              Popular Farm Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-[#1B5E20] hover:text-[#164d1a] inline-flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Produce</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onNavigate('marketplace', cat.name)}
              className="flex flex-col text-left p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-[#1B5E20] hover:shadow-md transition-all group active:scale-98"
            >
              <span className="text-3xl mb-3">{cat.icon}</span>
              <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#1B5E20] transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-snug">
                {cat.desc}
              </p>
              <span className="mt-3 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md self-start">
                {cat.count} listings
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Agricultural Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Hand-Picked This Week
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
              Featured Agricultural Products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-[#1B5E20] hover:text-[#164d1a] inline-flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={onViewProductDetails}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Fair & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-1">
            How FarmConnect Operates
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            By eliminating traditional mandi cartels, transport brokers, and speculative wholesalers, we bring farm freshness straight to households.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-[#1B5E20]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1B5E20] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-extrabold text-stone-300 font-mono tabular-nums">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">{s.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two-Sided Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Farmers */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-[#1B5E20] text-white space-y-6 shadow-md">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Grower Empowerment
              </span>
              <h3 className="text-2xl font-black font-display text-white mt-1">
                Benefits For Farmers
              </h3>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-emerald-50">
              <li className="flex items-start gap-3">
                <Percent className="w-5 h-5 text-[#F4C542] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">100% Fair Pricing Freedom</strong>
                  <span>Farmers dictate their own sale rates instead of taking distress prices from middlemen.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[#F4C542] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Instant Digital Settlements</strong>
                  <span>Direct bank deposits within 24 hours of fulfillment with zero hidden deductions.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[#F4C542] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Direct Customer Relationships</strong>
                  <span>Build loyal urban customer bases who subscribe to your seasonal harvest repeatedly.</span>
                </div>
              </li>
            </ul>

            <button
              onClick={() => onOpenAuth('register', 'farmer')}
              className="mt-4 px-5 py-3 bg-[#F4C542] hover:bg-[#e0b539] text-stone-900 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Register Your Farm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* For Consumers */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200 text-stone-900 space-y-6 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Conscious Living
              </span>
              <h3 className="text-2xl font-black font-display text-stone-900 mt-1">
                Benefits For Consumers
              </h3>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-stone-600">
              <li className="flex items-start gap-3">
                <Sprout className="w-5 h-5 text-[#1B5E20] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Unmatched Morning Freshness</strong>
                  <span>Produce picked just hours before delivery, retaining peak vitamins, crispness, and aroma.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1B5E20] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Chemical & Carbide Free</strong>
                  <span>No artificial acetylene ripening or toxic shelf-life extenders. 100% natural produce.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1B5E20] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900 font-semibold">Complete Origin Transparency</strong>
                  <span>Know the grower's name, farm location, soil practices, and harvest timestamp on every crate.</span>
                </div>
              </li>
            </ul>

            <button
              onClick={() => onNavigate('marketplace')}
              className="mt-4 px-5 py-3 bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Local Farmers Section */}
      <section id="local-farmers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Our Heroes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-1">
            Meet Our Verified Local Farmers
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Every farmer on FarmConnect is physically verified, practicing responsible agriculture with deep respect for the land.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {farmers.slice(0, 3).map((f) => (
            <div
              key={f.id}
              className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                    <img
                      src="/src/assets/images/farmer_portrait_field_1794483563891.jpg"
                      alt={f.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-bold text-stone-900">{f.name}</h4>
                      <Award className="w-4 h-4 text-[#4CAF50]" />
                    </div>
                    <p className="text-xs text-stone-500 font-medium">{f.farmName}</p>
                    <p className="text-[11px] text-emerald-800 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{f.farmLocation}</span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50 p-3 rounded-xl border border-stone-100">
                  "{f.farmBio || 'Dedicated to organic cultivation and sustainable soil conservation.'}"
                </p>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Crops Cultivated:
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px] text-stone-700">
                    {f.cropsGrown?.map((crop, idx) => (
                      <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded-md">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700">
                  {f.farmingExperience} Years Experience
                </span>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="font-bold text-[#1B5E20] hover:underline"
                >
                  View Harvests →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Agricultural Map of Participating Farms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Geographic Verification
              </span>
              <h2 className="text-2xl font-extrabold text-stone-900 font-display mt-0.5">
                Explore Farm Geolocation Hubs
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Real GPS coordinates across Maharashtra, Punjab, and Himachal Pradesh.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B5E20]"></span>
              <span>Active Producer Hubs</span>
            </div>
          </div>

          <FarmMap allFarmers={farmers} heightClass="h-80" />
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Real Voices
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display mt-1">
            Loved By Families & Growers
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Read direct feedback from consumers experiencing authentic farm produce and farmers who finally earn fair wages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <h4 className="text-xs font-bold text-stone-900">{t.name}</h4>
                <p className="text-[11px] text-stone-500">{t.role} · {t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
