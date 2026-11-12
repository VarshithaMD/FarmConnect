import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { api, authStorage } from './services/api';
import { User, Product, Order, CartItem, ProductCategory, Review } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authDefaultRole, setAuthDefaultRole] = useState<'customer' | 'farmer'>('customer');
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Detail Modal State
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailFarmer, setDetailFarmer] = useState<User | null>(null);
  const [detailReviews, setDetailReviews] = useState<Review[]>([]);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Load
  useEffect(() => {
    const initApp = async () => {
      // Restore user session if available
      const savedUser = authStorage.getUser();
      if (savedUser) {
        setUser(savedUser);
      }

      try {
        // Load products
        const prodRes = await api.getProducts();
        setProducts(prodRes.products);

        // Load farmers
        const farmRes = await api.getFarmers();
        setFarmers(farmRes.farmers);

        // Load orders if logged in
        if (savedUser) {
          const ordRes = await api.getOrders();
          setOrders(ordRes.orders);
        }
      } catch (e) {
        console.error('Initialization error:', e);
      }
    };

    initApp();
  }, []);

  // Sync orders when user changes
  useEffect(() => {
    if (user) {
      api.getOrders().then(res => setOrders(res.orders)).catch(console.error);
    } else {
      setOrders([]);
    }
  }, [user]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity} ${product.unit} of ${product.name} to your basket!`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from basket', 'info');
  };

  // View Product Details
  const handleViewProductDetails = async (product: Product) => {
    try {
      const data = await api.getProduct(product.id);
      setDetailProduct(data.product);
      setDetailFarmer(data.farmer);
      setDetailReviews(data.reviews);
    } catch {
      setDetailProduct(product);
      const farmer = farmers.find((f) => f.id === product.farmerId) || null;
      setDetailFarmer(farmer);
      setDetailReviews([]);
    }
  };

  // Submit Review
  const handleSubmitReview = async (productId: string, rating: number, comment: string) => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      throw new Error('Please sign in to submit a review');
    }
    const res = await api.submitReview(productId, rating, comment);
    setDetailReviews((prev) => [res.review, ...prev]);

    // Update local product list rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const count = p.reviewsCount + 1;
          const newAvg = Number(((p.rating * p.reviewsCount + rating) / count).toFixed(2));
          return { ...p, rating: newAvg, reviewsCount: count };
        }
        return p;
      })
    );
    showToast('Your verified review was posted! Thank you for supporting the farmer.');
  };

  // Farmer CRUD Operations
  const handleAddProduct = async (productData: Partial<Product>) => {
    const res = await api.createProduct(productData);
    setProducts((prev) => [res.product, ...prev]);
    showToast('New harvest produce listed on FarmConnect!');
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    const res = await api.updateProduct(id, productData);
    setProducts((prev) => prev.map((p) => (p.id === id ? res.product : p)));
    showToast('Produce listing updated successfully');
  };

  const handleDeleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produce listing removed', 'info');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    const res = await api.updateOrderStatus(orderId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));
    showToast(`Order status updated to ${status}`);
  };

  // Auth Operations
  const handleAuthSuccess = (loggedUser: User, _token: string) => {
    setUser(loggedUser);
    showToast(`Signed in as ${loggedUser.name} (${loggedUser.role})`);
    if (loggedUser.role === 'farmer') {
      setCurrentView('farmer_dashboard');
    } else {
      if (currentView === 'landing') {
        setCurrentView('marketplace');
      }
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setCurrentView('landing');
    showToast('Signed out of FarmConnect', 'info');
  };

  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    showToast('Order confirmed! Harvest request sent to local farmers.');
  };

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF5] text-slate-800">
      {/* Top Bar Navigation */}
      <Navbar
        user={user}
        cartCount={cartCount}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'farmer_dashboard' && (!user || user.role !== 'farmer')) {
            setAuthModalMode('login');
            setAuthDefaultRole('farmer');
            setAuthModalOpen(true);
            return;
          }
          if (view === 'customer_dashboard' && !user) {
            setAuthModalMode('login');
            setAuthDefaultRole('customer');
            setAuthModalOpen(true);
            return;
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={(mode = 'login', defaultRole = 'customer') => {
          setAuthModalMode(mode);
          setAuthDefaultRole(defaultRole);
          setAuthModalOpen(true);
        }}
        onOpenCart={() => setCartDrawerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-3 duration-200 border border-stone-800">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#4CAF50] shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#F4C542] shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            products={products}
            farmers={farmers}
            onNavigate={(view, cat) => {
              if (cat) setSelectedCategory(cat);
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={(mode, role) => {
              setAuthModalMode(mode || 'login');
              setAuthDefaultRole(role || 'customer');
              setAuthModalOpen(true);
            }}
            onAddToCart={handleAddToCart}
            onViewProductDetails={handleViewProductDetails}
          />
        )}

        {currentView === 'marketplace' && (
          <MarketplacePage
            products={products}
            initialCategory={selectedCategory}
            onAddToCart={handleAddToCart}
            onViewProductDetails={handleViewProductDetails}
          />
        )}

        {currentView === 'customer_dashboard' && user && (
          <CustomerDashboard
            user={user}
            orders={orders}
            recommendedProducts={products.slice(0, 6)}
            onAddToCart={handleAddToCart}
            onViewProductDetails={handleViewProductDetails}
            onNavigateMarketplace={() => setCurrentView('marketplace')}
          />
        )}

        {currentView === 'farmer_dashboard' && user && user.role === 'farmer' && (
          <FarmerDashboard
            user={user}
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={(mode, role) => {
          setAuthModalMode(mode || 'login');
          setAuthDefaultRole(role || 'customer');
          setAuthModalOpen(true);
        }}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={detailProduct}
        farmer={detailFarmer}
        reviews={detailReviews}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onSubmitReview={handleSubmitReview}
      />

      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setCheckoutModalOpen(true)}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        items={cart}
        user={user}
        onOrderSuccess={handleOrderSuccess}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        defaultRole={authDefaultRole}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
