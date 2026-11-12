import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, LogOut, ChevronDown, PlusCircle } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register', defaultRole?: 'customer' | 'farmer') => void;
  onOpenCart: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  cartCount,
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenCart,
  onLogout,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFAF5]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-xl font-bold tracking-tight text-[#1B5E20] whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-[#1B5E20] text-white flex items-center justify-center font-display font-extrabold text-lg shadow-sm">
            F
          </span>
          <span className="font-display tracking-tight text-[#1B5E20]">FarmConnect</span>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentView === 'landing'
                ? 'border-[#1B5E20] text-[#1B5E20] font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('marketplace')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
              currentView === 'marketplace'
                ? 'border-[#1B5E20] text-[#1B5E20] font-semibold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => {
              if (currentView !== 'landing') onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="whitespace-nowrap shrink-0 text-stone-600 hover:text-stone-900 transition-colors pb-0.5 border-b-2 border-transparent"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              if (currentView !== 'landing') onNavigate('landing');
              setTimeout(() => {
                const el = document.getElementById('local-farmers');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="whitespace-nowrap shrink-0 text-stone-600 hover:text-stone-900 transition-colors pb-0.5 border-b-2 border-transparent"
          >
            Our Farmers
          </button>
          {user && (
            <button
              onClick={() => onNavigate(user.role === 'farmer' ? 'farmer_dashboard' : 'customer_dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
                currentView.includes('dashboard')
                  ? 'border-[#1B5E20] text-[#1B5E20] font-semibold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              {user.role === 'farmer' ? 'Farmer Console' : 'My Orders'}
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Cart + Account) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors flex items-center justify-center border border-stone-200/60"
          >
            <ShoppingBag className="w-5 h-5 text-[#1B5E20]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#1B5E20] text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors text-xs font-medium text-stone-800"
              >
                <div className="w-6 h-6 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {user.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-stone-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      {user.role === 'farmer' ? user.farmName || 'Verified Farm' : 'Verified Consumer'}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate(user.role === 'farmer' ? 'farmer_dashboard' : 'customer_dashboard')}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-[#1B5E20]" />
                    <span>{user.role === 'farmer' ? 'Farmer Dashboard' : 'Customer Dashboard'}</span>
                  </button>

                  {user.role === 'farmer' && (
                    <button
                      onClick={() => onNavigate('farmer_dashboard')}
                      className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <span>Add New Produce</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-stone-100" />

                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register', 'farmer')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1B5E20] hover:bg-[#164d1a] rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 active:scale-95"
              >
                Sell Produce
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
