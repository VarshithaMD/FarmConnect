import React, { useState } from 'react';
import { X, Eye, EyeOff, Sprout, ShoppingBag, ShieldCheck, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  defaultRole?: UserRole;
  onAuthSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  defaultRole = 'customer',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Farmer specific
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmingExperience, setFarmingExperience] = useState('8');
  const [cropsGrown, setCropsGrown] = useState('Organic Vegetables, Herbs, Tomatoes');
  const [docName, setDocName] = useState('LandRecord_7_12_Extract.pdf');

  if (!isOpen) return null;

  const handleDemoLogin = async (demoRole: 'farmer' | 'customer') => {
    setError(null);
    setLoading(true);
    try {
      const demoEmail = demoRole === 'farmer' ? 'farmer@farmconnect.org' : 'customer@farmconnect.org';
      const demoPassword = demoRole === 'farmer' ? 'farmer123' : 'customer123';

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');

      localStorage.setItem('farmconnect_token', data.token);
      localStorage.setItem('farmconnect_user', JSON.stringify(data.user));
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotSuccess(null);

    if (mode === 'forgot') {
      setLoading(true);
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        setForgotSuccess(data.message || 'Reset link sent if email matches our database.');
      } catch (err: any) {
        setError(err.message || 'Failed to send reset link');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' ? { email, password } : {
        name,
        email,
        phone,
        password,
        role,
        address,
        city,
        state,
        pincode,
        ...(role === 'farmer' && {
          farmName,
          farmLocation,
          farmingExperience: Number(farmingExperience),
          cropsGrown: cropsGrown.split(',').map(s => s.trim()),
          docName
        })
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication error');

      localStorage.setItem('farmconnect_token', data.token);
      localStorage.setItem('farmconnect_user', JSON.stringify(data.user));
      onAuthSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header with Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#1B5E20] text-white flex items-center justify-center font-bold text-xs">
              F
            </span>
            <span className="font-bold text-sm text-stone-900 font-display">
              {mode === 'login' ? 'Sign In to FarmConnect' : mode === 'register' ? 'Create Your Account' : 'Reset Password'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick 1-Click Demo Login Bar */}
          {mode === 'login' && (
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block mb-2">
                Fast 1-Click Demo Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('farmer')}
                  disabled={loading}
                  className="px-3 py-2 text-xs font-semibold bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Login as Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('customer')}
                  disabled={loading}
                  className="px-3 py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-900 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Login as Customer</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'login' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === 'register' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {/* Role selector on register */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">I am joining as a:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                    role === 'customer'
                      ? 'border-[#1B5E20] bg-emerald-50/50 text-[#1B5E20] ring-1 ring-[#1B5E20]'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold">Consumer</span>
                    <span className="block text-[11px] text-stone-500">Buy fresh farm produce</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                    role === 'farmer'
                      ? 'border-[#1B5E20] bg-emerald-50/50 text-[#1B5E20] ring-1 ring-[#1B5E20]'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Sprout className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold">Farmer / Producer</span>
                    <span className="block text-[11px] text-stone-500">Sell direct to households</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Forgot Password Success Message */}
          {forgotSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{forgotSuccess}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'forgot' ? (
              <div className="space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enter your registered email address. We will verify your account and provide you with instant instructions.
                </p>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                    placeholder="e.g. yourname@gmail.com"
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Registration Fields */}
                {mode === 'register' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                          placeholder="e.g. Ramesh Patil"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                          placeholder="+91 98230 45671"
                        />
                      </div>
                    </div>

                    {/* Farmer Specific Fields */}
                    {role === 'farmer' && (
                      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
                        <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[#1B5E20]" />
                          <span>Farmer & Agriculture Profile</span>
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-stone-700 font-semibold mb-1">Farm Name</label>
                            <input
                              type="text"
                              required
                              value={farmName}
                              onChange={e => setFarmName(e.target.value)}
                              className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                              placeholder="e.g. Sahyadri Green Organics"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-700 font-semibold mb-1">Farm Location / Taluka</label>
                            <input
                              type="text"
                              required
                              value={farmLocation}
                              onChange={e => setFarmLocation(e.target.value)}
                              className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                              placeholder="e.g. Dindori, Nashik"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-700 font-semibold mb-1">Farming Experience (Years)</label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={farmingExperience}
                              onChange={e => setFarmingExperience(e.target.value)}
                              className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-700 font-semibold mb-1">Primary Crops Grown</label>
                            <input
                              type="text"
                              required
                              value={cropsGrown}
                              onChange={e => setCropsGrown(e.target.value)}
                              className="w-full p-2 rounded-lg border border-stone-300 bg-white"
                              placeholder="Tomatoes, Grapes, Spinach"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-stone-700 font-semibold mb-1">Verification Document Proof</label>
                          <div className="flex items-center gap-2 p-2 rounded-lg border border-dashed border-emerald-300 bg-white text-[11px] text-stone-600">
                            <ShieldCheck className="w-4 h-4 text-[#4CAF50] shrink-0" />
                            <span className="truncate flex-1 font-mono">{docName}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">Attached</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Address Fields */}
                    <div className="space-y-2">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Address</label>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden"
                          placeholder="Street, locality, landmarks"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-stone-700 font-semibold mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full p-2 rounded-lg border border-stone-300"
                            placeholder="Pune"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 font-semibold mb-1">State</label>
                          <input
                            type="text"
                            required
                            value={state}
                            onChange={e => setState(e.target.value)}
                            className="w-full p-2 rounded-lg border border-stone-300"
                            placeholder="Maharashtra"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 font-semibold mb-1">PIN Code</label>
                          <input
                            type="text"
                            required
                            value={pincode}
                            onChange={e => setPincode(e.target.value)}
                            className="w-full p-2 rounded-lg border border-stone-300"
                            placeholder="411001"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Common Email */}
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                    placeholder="you@domain.com"
                  />
                </div>

                {/* Password with Visibility Toggle */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-stone-700 font-semibold">Password</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-emerald-800 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full p-2.5 pr-10 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password for Register */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full p-2.5 pr-10 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1B5E20] hover:bg-[#164d1a] text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-98"
            >
              {loading
                ? 'Validating...'
                : mode === 'login'
                ? 'Sign In to Account'
                : mode === 'register'
                ? `Complete Registration as ${role === 'farmer' ? 'Farmer' : 'Consumer'}`
                : 'Send Password Reset Code'}
            </button>

            {mode === 'forgot' && (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-stone-600 hover:text-stone-900 transition-colors pt-2 block"
              >
                Back to Sign In
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
