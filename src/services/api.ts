import { Product, User, Order, Review, FarmerAnalytics } from '../types';

const TOKEN_KEY = 'farmconnect_token';
const USER_KEY = 'farmconnect_user';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'API request failed');
  }
  return data;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const data = await apiRequest<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    authStorage.setToken(data.token);
    authStorage.setUser(data.user);
    return data;
  },

  async register(payload: any): Promise<{ user: User; token: string }> {
    const data = await apiRequest<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    authStorage.setToken(data.token);
    authStorage.setUser(data.user);
    return data;
  },

  async getMe(): Promise<User | null> {
    try {
      const data = await apiRequest<{ user: User }>('/api/auth/me');
      authStorage.setUser(data.user);
      return data.user;
    } catch {
      authStorage.clear();
      return null;
    }
  },

  async forgotPassword(email: string): Promise<{ message: string; resetCode?: string }> {
    return apiRequest<{ message: string; resetCode?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  logout() {
    authStorage.clear();
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    organicOnly?: boolean;
    sort?: string;
    farmerId?: string;
  }): Promise<{ products: Product[]; total: number }> {
    const q = new URLSearchParams();
    if (params?.category && params.category !== 'All') q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    if (params?.minPrice !== undefined) q.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) q.set('maxPrice', String(params.maxPrice));
    if (params?.organicOnly) q.set('organicOnly', 'true');
    if (params?.sort) q.set('sort', params.sort);
    if (params?.farmerId) q.set('farmerId', params.farmerId);

    const queryStr = q.toString() ? `?${q.toString()}` : '';
    return apiRequest<{ products: Product[]; total: number }>(`/api/products${queryStr}`);
  },

  async getProduct(id: string): Promise<{ product: Product; farmer: User; reviews: Review[] }> {
    return apiRequest<{ product: Product; farmer: User; reviews: Review[] }>(`/api/products/${id}`);
  },

  async createProduct(payload: Partial<Product>): Promise<{ product: Product; message: string }> {
    return apiRequest<{ product: Product; message: string }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(id: string, payload: Partial<Product>): Promise<{ product: Product; message: string }> {
    return apiRequest<{ product: Product; message: string }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Farmers
  async getFarmers(): Promise<{ farmers: User[] }> {
    return apiRequest<{ farmers: User[] }>('/api/farmers');
  },

  async getFarmerProfile(id: string): Promise<{ farmer: User; products: Product[] }> {
    return apiRequest<{ farmer: User; products: Product[] }>(`/api/farmers/${id}`);
  },

  // Orders
  async getOrders(): Promise<{ orders: Order[] }> {
    return apiRequest<{ orders: Order[] }>('/api/orders');
  },

  async placeOrder(orderPayload: any): Promise<{ order: Order; message: string }> {
    return apiRequest<{ order: Order; message: string }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
  },

  async updateOrderStatus(orderId: string, status: string): Promise<{ order: Order; message: string }> {
    return apiRequest<{ order: Order; message: string }>(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Analytics
  async getFarmerAnalytics(): Promise<{ analytics: FarmerAnalytics }> {
    return apiRequest<{ analytics: FarmerAnalytics }>('/api/farmer/analytics');
  },

  // Reviews
  async submitReview(productId: string, rating: number, comment: string): Promise<{ review: Review; message: string }> {
    return apiRequest<{ review: Review; message: string }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, rating, comment }),
    });
  },

  // Payments (Razorpay Demo)
  async createRazorpayOrder(amount: number) {
    return apiRequest<any>('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  async verifyPayment(orderId: string, paymentId?: string) {
    return apiRequest<any>('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentId }),
    });
  }
};
