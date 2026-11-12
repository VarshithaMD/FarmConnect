export type UserRole = 'customer' | 'farmer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  // Farmer specific fields
  farmName?: string;
  farmLocation?: string;
  farmingExperience?: number; // years
  cropsGrown?: string[];
  verificationStatus?: 'verified' | 'pending' | 'unverified';
  farmCoordinates?: {
    lat: number;
    lng: number;
  };
  farmBio?: string;
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Dairy'
  | 'Organic Produce';

export type ProductUnit = 'kg' | 'g' | 'liter' | 'dozen' | 'bundle' | 'box';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmLocation: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  stock: number;
  isOrganic: boolean;
  harvestDate: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  pesticideFree?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerId: string;
  rating: number;
  comment: string;
  date: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  unit: ProductUnit;
  quantity: number;
  farmerId: string;
  farmerName: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'razorpay_demo' | 'cod';
  paymentStatus: 'paid' | 'pending_cod';
  orderStatus: OrderStatus;
  createdAt: string;
  deliveryDateEstimate: string;
  farmerIds: string[];
}

export interface FarmerAnalytics {
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  categoryBreakdown: { name: string; value: number }[];
  totalOrders: number;
  totalProducts: number;
  activeListings: number;
  totalProduceSoldKg: number;
}
