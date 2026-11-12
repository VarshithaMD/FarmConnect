import React from 'react';
import { Sprout, Phone, Mail, MapPin, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register', defaultRole?: 'customer' | 'farmer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Pillars Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-stone-800">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Direct From Farmers</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Zero middlemen markups. Every penny goes straight to the hardworking farming families who cultivate your food.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Harvest-to-Door Freshness</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Produce is picked at dawn and dispatched within 12 hours. Never languishing in cold storage or artificial ripening chambers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Fair Price Guarantee</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Farmers set their own honest prices and retain 95%+ of the sale, compared to traditional mandis where they receive barely 20%.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#4CAF50] text-stone-900 flex items-center justify-center font-display font-extrabold text-lg">
                F
              </span>
              <span className="text-xl font-bold tracking-tight text-white font-display">FarmConnect</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Empowering local Indian agricultural communities through transparent, direct-to-consumer technology. Fresh, honest, organic harvest delivered directly to your kitchen.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Government Registered FPO Network</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Produce Catalog</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Fresh Farm Vegetables
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Mountain & Orchard Fruits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Heritage Grains & Millets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Organic Desi Pulses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Artisan Dairy & Raw Forest Honey
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">For Farmers</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onOpenAuth('register', 'farmer')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Join as a Verified Farmer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('login', 'farmer')}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Farmer Portal Login
                </button>
              </li>
              <li>
                <span className="text-stone-500">Free Logistics & Crate Assistance</span>
              </li>
              <li>
                <span className="text-stone-500">Soil Testing & Organic Certification Aid</span>
              </li>
              <li>
                <span className="text-stone-500">FPO Direct Bulk Buying</span>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Reach Support</h5>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Farmer Hotline: 1800-419-FARM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@farmconnect.org</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Agricultural Hub, Agri-Tech Center, Pune - 411005, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 FarmConnect Technologies. Direct Farmer-to-Consumer Agricultural Platform.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Trade</span>
            <span>·</span>
            <span>Quality Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
