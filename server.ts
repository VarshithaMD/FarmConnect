import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS } from './src/data/initialData';
import { User, Product, Order, Review, FarmerAnalytics } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory + persistent cache state
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'farmconnect_db.json');

interface DatabaseSchema {
  users: User[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  passwords: Record<string, string>; // userId -> password/hash
}

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.users && parsed.products && parsed.orders) {
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse database file, resetting to initial seed:', e);
    }
  }

  const initialDb: DatabaseSchema = {
    users: [...INITIAL_USERS],
    products: [...INITIAL_PRODUCTS],
    orders: [...INITIAL_ORDERS],
    reviews: [...INITIAL_REVIEWS],
    passwords: {
      'farmer-1': 'farmer123',
      'farmer-2': 'farmer123',
      'farmer-3': 'farmer123',
      'customer-1': 'customer123',
    }
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial db:', err);
  }

  return initialDb;
}

const db = initDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

// Token simulation map
const tokenMap = new Map<string, string>(); // token -> userId

function generateToken(userId: string): string {
  const token = `fc_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  tokenMap.set(token, userId);
  return token;
}

function authenticate(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  const userId = tokenMap.get(token);
  if (!userId) return null;
  return db.users.find(u => u.id === userId) || null;
}

// ----------------- AUTH ROUTES -----------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    password,
    role,
    address,
    city,
    state,
    pincode,
    farmName,
    farmLocation,
    farmingExperience,
    cropsGrown,
  } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Missing required registration fields' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email address already exists' });
  }

  const userId = `${role}-${Date.now().toString().slice(-6)}`;
  const newUser: User = {
    id: userId,
    name: name.trim(),
    email: normalizedEmail,
    phone: phone || '',
    role: role === 'farmer' ? 'farmer' : 'customer',
    address: address || '',
    city: city || 'Pune',
    state: state || 'Maharashtra',
    pincode: pincode || '411001',
    createdAt: new Date().toISOString(),
    ...(role === 'farmer' && {
      farmName: farmName || `${name}'s Organic Farm`,
      farmLocation: farmLocation || `${city || 'Rural'}, ${state || 'India'}`,
      farmingExperience: Number(farmingExperience) || 5,
      cropsGrown: Array.isArray(cropsGrown) ? cropsGrown : ['Seasonal Vegetables', 'Herbs'],
      verificationStatus: 'verified',
      farmCoordinates: {
        lat: 19.9975 + (Math.random() - 0.5) * 2,
        lng: 73.7898 + (Math.random() - 0.5) * 2
      },
      farmBio: `Sustainable grower dedicated to chemical-free agriculture and direct consumer distribution.`
    })
  };

  db.users.push(newUser);
  db.passwords[userId] = password;
  saveDatabase();

  const token = generateToken(userId);
  return res.status(201).json({
    user: newUser,
    token,
    message: 'Registration successful'
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const storedPassword = db.passwords[user.id];
  if (storedPassword && storedPassword !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user.id);
  return res.json({
    user,
    token,
    message: 'Welcome back!'
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.json({ user });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    return res.json({ message: 'If this email exists in our records, password instructions have been sent.' });
  }

  return res.json({
    message: `A reset code has been sent to ${email}. (Demo reset code: 749210)`,
    resetCode: '749210'
  });
});

// ----------------- PRODUCTS ROUTES -----------------
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, organicOnly, farmerId, sort } = req.query;

  let results = [...db.products];

  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (farmerId) {
    results = results.filter(p => p.farmerId === farmerId);
  }

  if (organicOnly === 'true') {
    results = results.filter(p => p.isOrganic);
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min)) results = results.filter(p => p.price >= min);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) results = results.filter(p => p.price <= max);
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q) ||
      p.farmLocation.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    results.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  return res.json({ products: results, total: results.length });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const farmer = db.users.find(u => u.id === product.farmerId);
  const reviews = db.reviews.filter(r => r.productId === product.id);

  return res.json({
    product,
    farmer,
    reviews
  });
});

app.post('/api/products', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user || user.role !== 'farmer') {
    return res.status(403).json({ error: 'Only verified farmers can add new produce listings' });
  }

  const { name, category, price, unit, stock, isOrganic, description, image, harvestDate } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Product name, category, and price are required' });
  }

  const newProduct: Product = {
    id: `prod-${Date.now().toString().slice(-6)}`,
    farmerId: user.id,
    farmerName: user.name,
    farmName: user.farmName || `${user.name}'s Farm`,
    farmLocation: user.farmLocation || `${user.city}, ${user.state}`,
    name: name.trim(),
    category,
    price: Number(price),
    unit: unit || 'kg',
    stock: Number(stock) || 50,
    isOrganic: Boolean(isOrganic),
    harvestDate: harvestDate || 'Fresh Morning Harvest',
    description: description || 'Fresh farm-direct produce with zero artificial ripening agents.',
    image: image || '/src/assets/images/product_fresh_organic_vegetables_1794483563500.jpg',
    rating: 5.0,
    reviewsCount: 1,
    featured: false,
    pesticideFree: true
  };

  db.products.unshift(newProduct);
  saveDatabase();

  return res.status(201).json({ product: newProduct, message: 'Produce listing created successfully!' });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user || user.role !== 'farmer') {
    return res.status(403).json({ error: 'Unauthorized to modify this listing' });
  }

  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Ensure farmer owns the product
  if (db.products[idx].farmerId !== user.id) {
    return res.status(403).json({ error: 'You can only edit your own produce listings' });
  }

  const updatedProduct: Product = {
    ...db.products[idx],
    ...req.body,
    id: db.products[idx].id, // preserve ID
    farmerId: user.id,
    price: Number(req.body.price ?? db.products[idx].price),
    stock: Number(req.body.stock ?? db.products[idx].stock)
  };

  db.products[idx] = updatedProduct;
  saveDatabase();

  return res.json({ product: updatedProduct, message: 'Produce updated successfully' });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user || user.role !== 'farmer') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  if (db.products[idx].farmerId !== user.id) {
    return res.status(403).json({ error: 'You can only delete your own produce listings' });
  }

  db.products.splice(idx, 1);
  saveDatabase();

  return res.json({ message: 'Produce listing removed' });
});

// ----------------- FARMERS DIRECTORY -----------------
app.get('/api/farmers', (_req: Request, res: Response) => {
  const farmers = db.users
    .filter(u => u.role === 'farmer')
    .map(f => {
      const farmProducts = db.products.filter(p => p.farmerId === f.id);
      return {
        ...f,
        totalProductsCount: farmProducts.length,
        averageRating: 4.9,
      };
    });

  return res.json({ farmers });
});

app.get('/api/farmers/:id', (req: Request, res: Response) => {
  const farmer = db.users.find(u => u.id === req.params.id && u.role === 'farmer');
  if (!farmer) return res.status(404).json({ error: 'Farmer not found' });

  const products = db.products.filter(p => p.farmerId === farmer.id);
  return res.json({ farmer, products });
});

// ----------------- ORDERS -----------------
app.get('/api/orders', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  let userOrders: Order[] = [];
  if (user.role === 'customer') {
    userOrders = db.orders.filter(o => o.customerId === user.id);
  } else if (user.role === 'farmer') {
    userOrders = db.orders.filter(o => o.farmerIds.includes(user.id));
  }

  // Sort descending by date
  userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return res.json({ orders: userOrders });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user) {
    return res.status(401).json({ error: 'Please sign in to place an order' });
  }

  const { items, deliveryAddress, paymentMethod, totalAmount, subtotal, deliveryFee } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const farmerIds = Array.from(new Set(items.map((it: any) => it.farmerId).filter(Boolean))) as string[];

  const newOrder: Order = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: user.id,
    customerName: user.name,
    customerPhone: user.phone || req.body.phone || '+91 99000 00000',
    customerEmail: user.email,
    deliveryAddress: deliveryAddress || {
      street: user.address || 'Civil Lines',
      city: user.city || 'Pune',
      state: user.state || 'Maharashtra',
      pincode: user.pincode || '411001'
    },
    items,
    subtotal: Number(subtotal) || Number(totalAmount),
    deliveryFee: Number(deliveryFee) || 0,
    totalAmount: Number(totalAmount),
    paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay_demo',
    paymentStatus: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
    orderStatus: 'confirmed',
    createdAt: new Date().toISOString(),
    deliveryDateEstimate: 'Tomorrow by 11:00 AM',
    farmerIds
  };

  // Deduct stock
  items.forEach((item: any) => {
    const prod = db.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  db.orders.unshift(newOrder);
  saveDatabase();

  return res.status(201).json({
    order: newOrder,
    message: 'Order placed successfully! The farmer has received your harvest request.'
  });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user || user.role !== 'farmer') {
    return res.status(403).json({ error: 'Only farmers can update delivery status' });
  }

  const { status } = req.body;
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.orderStatus = status;
  saveDatabase();

  return res.json({ order, message: `Order status updated to ${status}` });
});

// ----------------- ANALYTICS -----------------
app.get('/api/farmer/analytics', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user || user.role !== 'farmer') {
    return res.status(403).json({ error: 'Only farmers can access analytics' });
  }

  const farmerOrders = db.orders.filter(o => o.farmerIds.includes(user.id));
  const farmerProducts = db.products.filter(p => p.farmerId === user.id);

  let totalRevenue = 0;
  let totalProduceSoldKg = 0;

  farmerOrders.forEach(o => {
    o.items.forEach(item => {
      if (item.farmerId === user.id) {
        totalRevenue += item.price * item.quantity;
        totalProduceSoldKg += item.quantity * (item.unit === 'box' ? 5 : 1);
      }
    });
  });

  const monthlyRevenue = [
    { month: 'Jun', revenue: 14200, orders: 28 },
    { month: 'Jul', revenue: 18500, orders: 36 },
    { month: 'Aug', revenue: 22100, orders: 42 },
    { month: 'Sep', revenue: 26800, orders: 50 },
    { month: 'Oct', revenue: 31400, orders: 62 },
    { month: 'Nov', revenue: totalRevenue > 0 ? totalRevenue : 38900, orders: farmerOrders.length || 74 },
  ];

  const categoryBreakdown = [
    { name: 'Vegetables', value: 45 },
    { name: 'Fruits', value: 25 },
    { name: 'Grains', value: 15 },
    { name: 'Dairy & Honey', value: 15 },
  ];

  const analytics: FarmerAnalytics = {
    totalRevenue: totalRevenue || 128400,
    monthlyRevenue,
    categoryBreakdown,
    totalOrders: farmerOrders.length || 74,
    totalProducts: farmerProducts.length,
    activeListings: farmerProducts.filter(p => p.stock > 0).length,
    totalProduceSoldKg: totalProduceSoldKg || 1250,
  };

  return res.json({ analytics });
});

// ----------------- REVIEWS -----------------
app.post('/api/reviews', (req: Request, res: Response) => {
  const user = authenticate(req);
  if (!user) return res.status(401).json({ error: 'Please login to submit a review' });

  const { productId, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    return res.status(400).json({ error: 'Product ID, rating, and review comment are required' });
  }

  const newReview: Review = {
    id: `rev-${Date.now().toString().slice(-6)}`,
    productId,
    customerName: user.name,
    customerId: user.id,
    rating: Number(rating),
    comment: comment.trim(),
    date: new Date().toISOString().split('T')[0]
  };

  db.reviews.unshift(newReview);

  // Update product rating
  const prod = db.products.find(p => p.id === productId);
  if (prod) {
    prod.reviewsCount += 1;
    prod.rating = Number(((prod.rating * (prod.reviewsCount - 1) + Number(rating)) / prod.reviewsCount).toFixed(2));
  }

  saveDatabase();
  return res.status(201).json({ review: newReview, message: 'Thank you for supporting our local farmer!' });
});

// ----------------- RAZORPAY TEST / DEMO PAYMENT -----------------
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const { amount } = req.body;
  const orderId = `rzp_order_${Date.now().toString().slice(-8)}`;
  return res.json({
    orderId,
    currency: 'INR',
    amount: (Number(amount) || 100) * 100, // paise
    keyId: 'rzp_test_farmconnect2026',
    status: 'created',
    mode: 'test_demo'
  });
});

app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { paymentId, orderId } = req.body;
  return res.json({
    verified: true,
    paymentId: paymentId || `pay_${Date.now().toString().slice(-6)}`,
    orderId,
    message: 'Payment verified successfully in Razorpay Test Gateway'
  });
});

// ----------------- DEV / PROD MIDDLEWARE -----------------
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`FarmConnect full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
