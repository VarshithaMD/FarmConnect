import React, { useState } from 'react';
import {
  Sprout,
  PlusCircle,
  Package,
  TrendingUp,
  DollarSign,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  X,
  ShieldCheck,
  Phone,
  BarChart3,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { User, Product, Order, ProductCategory, ProductUnit } from '../types';
import { FarmMap } from '../components/FarmMap';

interface FarmerDashboardProps {
  user: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (productData: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  user,
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics' | 'profile'>('inventory');

  // Add/Edit Product Modal State
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Form Fields
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Vegetables');
  const [prodPrice, setProdPrice] = useState<number>(60);
  const [prodUnit, setProdUnit] = useState<ProductUnit>('kg');
  const [prodStock, setProdStock] = useState<number>(50);
  const [prodIsOrganic, setProdIsOrganic] = useState<boolean>(true);
  const [prodHarvestDate, setProdHarvestDate] = useState<string>('Harvested Today Morning');
  const [prodDesc, setProdDesc] = useState<string>('');
  const [prodImage, setProdImage] = useState<string>('/src/assets/images/product_fresh_organic_vegetables_1794483563500.jpg');

  // Filter farmer's own products and orders
  const myProducts = products.filter(p => p.farmerId === user.id);
  const myOrders = orders.filter(o => o.farmerIds.includes(user.id));

  // Compute Analytics
  let totalRevenue = 0;
  let totalKgSold = 0;
  myOrders.forEach(order => {
    order.items.forEach(item => {
      if (item.farmerId === user.id) {
        totalRevenue += item.price * item.quantity;
        totalKgSold += item.quantity * (item.unit === 'box' ? 5 : 1);
      }
    });
  });

  const pendingOrders = myOrders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');

  const chartData = [
    { month: 'Jun', revenue: 14200, orders: 28 },
    { month: 'Jul', revenue: 18500, orders: 36 },
    { month: 'Aug', revenue: 22100, orders: 42 },
    { month: 'Sep', revenue: 26800, orders: 50 },
    { month: 'Oct', revenue: 31400, orders: 62 },
    { month: 'Nov', revenue: totalRevenue > 0 ? totalRevenue : 38900, orders: myOrders.length || 74 },
  ];

  const pieColors = ['#1B5E20', '#4CAF50', '#81C784', '#F4C542', '#FFB74D'];
  const categoryData = [
    { name: 'Vegetables', value: 45 },
    { name: 'Fruits', value: 25 },
    { name: 'Grains & Pulses', value: 20 },
    { name: 'Dairy & Honey', value: 10 },
  ];

  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingProduct(null);
    setProdName('');
    setProdCategory('Vegetables');
    setProdPrice(60);
    setProdUnit('kg');
    setProdStock(50);
    setProdIsOrganic(true);
    setProdHarvestDate('Harvested Today at Dawn');
    setProdDesc('Farm-fresh produce with natural fertilization and zero artificial ripening chemicals.');
    setProdImage('/src/assets/images/product_fresh_organic_vegetables_1794483563500.jpg');
  };

  const handleOpenEdit = (p: Product) => {
    setModalMode('edit');
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdPrice(p.price);
    setProdUnit(p.unit);
    setProdStock(p.stock);
    setProdIsOrganic(p.isOrganic);
    setProdHarvestDate(p.harvestDate);
    setProdDesc(p.description);
    setProdImage(p.image);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      if (modalMode === 'add') {
        await onAddProduct({
          name: prodName,
          category: prodCategory,
          price: Number(prodPrice),
          unit: prodUnit,
          stock: Number(prodStock),
          isOrganic: prodIsOrganic,
          harvestDate: prodHarvestDate,
          description: prodDesc,
          image: prodImage,
        });
      } else if (modalMode === 'edit' && editingProduct) {
        await onUpdateProduct(editingProduct.id, {
          name: prodName,
          category: prodCategory,
          price: Number(prodPrice),
          unit: prodUnit,
          stock: Number(prodStock),
          isOrganic: prodIsOrganic,
          harvestDate: prodHarvestDate,
          description: prodDesc,
          image: prodImage,
        });
      }
      setModalMode(null);
    } catch (err: any) {
      alert(err.message || 'Error saving produce listing');
    } finally {
      setSavingProduct(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-[#1B5E20] to-emerald-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Verified Producer Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            {user.farmName || `${user.name}'s Farm`}
          </h1>
          <p className="text-xs sm:text-sm text-stone-200">
            {user.farmLocation || `${user.city}, ${user.state}`} · {user.farmingExperience || 10} Years Experience · 0% Middlemen Cut
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="self-start md:self-auto px-5 py-3 bg-[#4CAF50] hover:bg-[#43a047] text-stone-950 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Produce</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Direct Revenue
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#1B5E20] font-mono tabular-nums">
              ₹{(totalRevenue > 0 ? totalRevenue : 38900).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">100% retained earnings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Pending Orders
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono tabular-nums">
              {pendingOrders.length}
            </span>
            <span className="text-xs text-stone-400">to pack & dispatch</span>
          </div>
          <p className="text-[11px] text-stone-500">Scheduled for today</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Active Produce Listings
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tabular-nums">
              {myProducts.length}
            </span>
            <span className="text-xs text-stone-400">crops</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">All GPS verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Produce Dispatched
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tabular-nums">
              {(totalKgSold > 0 ? totalKgSold : 420).toLocaleString()} kg
            </span>
          </div>
          <p className="text-[11px] text-stone-500">Zero cold storage loss</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'inventory'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Produce Inventory ({myProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Customer Orders ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'analytics'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Sales & Demand Analytics
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'profile'
              ? 'bg-[#1B5E20] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Farm Location & Bio
        </button>
      </div>

      {/* TAB 1: Inventory Management */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">Your Harvest Listings</h3>
              <p className="text-xs text-stone-500">
                Manage stock availability, adjust harvest dates, and update direct pricing.
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#1B5E20] hover:bg-[#164d1a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Harvest</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            {myProducts.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-stone-800">No Produce Listed Yet</h4>
                <p className="text-xs text-stone-500">Start listing your fresh farm crops to connect directly with consumers.</p>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 bg-[#1B5E20] text-white text-xs font-bold rounded-xl"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                    <tr>
                      <th className="p-4">Crop Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Available Stock</th>
                      <th className="p-4">Harvest Status</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-xl object-cover bg-stone-100 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-stone-900 block">{p.name}</span>
                              {p.isOrganic && (
                                <span className="text-[10px] text-emerald-800 font-semibold inline-flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-[#4CAF50]" /> Organic
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-stone-700">{p.category}</td>
                        <td className="p-4 font-mono font-bold tabular-nums text-[#1B5E20]">
                          ₹{p.price} /{p.unit}
                        </td>
                        <td className="p-4 font-mono tabular-nums">
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            p.stock > 10 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {p.stock} {p.unit}
                          </span>
                        </td>
                        <td className="p-4 text-stone-600">{p.harvestDate}</td>
                        <td className="p-4 font-mono tabular-nums text-stone-800">
                          ★ {p.rating} ({p.reviewsCount})
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                              title="Edit listing"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove listing "${p.name}"?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Customer Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-stone-900">Incoming Harvest Orders</h3>
              <p className="text-xs text-stone-500">
                Direct customer orders requiring dawn harvest, packing, and dispatch.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {myOrders.length} Total Orders
            </span>
          </div>

          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 space-y-2">
                <Truck className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="text-sm font-bold text-stone-800">No Orders Currently</h4>
                <p className="text-xs text-stone-500">As consumers discover your listings, incoming delivery requests will appear here.</p>
              </div>
            ) : (
              myOrders.map((o) => {
                const myItems = o.items.filter(it => it.farmerId === user.id);
                return (
                  <div key={o.id} className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-stone-900">{o.id}</span>
                          <span className="text-[11px] font-semibold text-stone-500">
                            · {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Customer: <strong className="text-stone-900">{o.customerName}</strong> ({o.customerPhone})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-stone-500">Status:</span>
                        <select
                          value={o.orderStatus}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                          className="p-1.5 rounded-lg border border-stone-300 bg-stone-50 text-xs font-bold text-stone-800 focus:outline-hidden"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="packed">Packed</option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Ordered produce items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {myItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100">
                          <div>
                            <span className="font-bold text-stone-900 block">{item.productName}</span>
                            <span className="text-stone-500 text-[11px]">Quantity: {item.quantity} {item.unit}</span>
                          </div>
                          <span className="font-mono font-bold tabular-nums text-stone-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#1B5E20]" />
                        <span>Delivery Address: {o.deliveryAddress.street}, {o.deliveryAddress.city}, PIN: {o.deliveryAddress.pincode}</span>
                      </span>
                      <span className="font-bold text-emerald-800">
                        Payment: {o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Sales & Analytics (Recharts) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Monthly Trend Area/Bar */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#1B5E20]" />
                    <span>Monthly Revenue Performance (₹)</span>
                  </h3>
                  <p className="text-xs text-stone-500">Continuous 6-month growth via direct-to-consumer sales.</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg">
                  +38% vs Mandi
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      formatter={(val: any) => [`₹${val}`, 'Revenue']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Bar dataKey="revenue" fill="#1B5E20" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown Donut */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#1B5E20]" />
                  <span>Crop Revenue Share</span>
                </h3>
                <p className="text-xs text-stone-500">Sales volume percentage by category.</p>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Share']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-[11px] pt-2 border-t border-stone-100">
                {categoryData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i] }}></span>
                      <span className="text-stone-700">{cat.name}</span>
                    </div>
                    <span className="font-mono tabular-nums font-bold text-stone-900">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Farm Location & Profile */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Grower Verification
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-display mt-0.5">
                Farm Credentials & Practices
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Registered Farm:</span>
                  <span className="font-bold text-stone-900">{user.farmName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Cultivation Belt:</span>
                  <span className="font-semibold text-stone-800">{user.farmLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Farming Experience:</span>
                  <span className="font-semibold text-stone-800">{user.farmingExperience} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Audit Status:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Physically Inspected
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-700 block mb-1">Crops Cultivated:</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.cropsGrown?.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {user.farmBio && (
                <div>
                  <span className="font-bold text-stone-700 block mb-1">Farm Mission Statement:</span>
                  <p className="p-3 rounded-xl bg-stone-50 text-stone-600 italic border border-stone-200/60 leading-relaxed">
                    "{user.farmBio}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1B5E20]" />
                <span>Farm GPS Boundary</span>
              </h3>
              <p className="text-xs text-stone-500">
                Consumers see this exact map location on your product detail pages.
              </p>
            </div>
            <FarmMap farmer={user} heightClass="h-72" />
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
              <h3 className="text-sm font-bold text-stone-900 font-display">
                {modalMode === 'add' ? 'List New Harvest Produce' : 'Edit Harvest Listing'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Produce / Crop Name</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  placeholder="e.g. Crisp Mountain Gala Apples"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={e => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Organic Produce">Organic Produce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Unit of Measurement</label>
                  <select
                    value={prodUnit}
                    onChange={e => setProdUnit(e.target.value as ProductUnit)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="kg">Per kg</option>
                    <option value="box">Per box / crate</option>
                    <option value="liter">Per liter</option>
                    <option value="bundle">Per bundle</option>
                    <option value="dozen">Per dozen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Direct Farmer Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={prodPrice}
                    onChange={e => setProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Current Stock ({prodUnit})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={prodStock}
                    onChange={e => setProdStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Harvest Timestamp / Freshness</label>
                <input
                  type="text"
                  required
                  value={prodHarvestDate}
                  onChange={e => setProdHarvestDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                  placeholder="e.g. Harvested Today Dawn / Plucked Yesterday"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description & Variety</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={e => setProdDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                  placeholder="Describe seed variety, flavor notes, zero chemical guarantee..."
                />
              </div>

              {/* Preset Image Selector */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Select High-Resolution Photo</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Vegetables', url: '/src/assets/images/product_fresh_organic_vegetables_1794483563500.jpg' },
                    { label: 'Fruits', url: '/src/assets/images/product_farm_fresh_fruits_1794483563410.jpg' },
                    { label: 'Dairy & Honey', url: '/src/assets/images/product_artisan_dairy_honey_1794483564124.jpg' },
                    { label: 'Grains & Fields', url: '/src/assets/images/hero_farm_landscape_1794483561808.jpg' },
                  ].map((imgChoice) => (
                    <button
                      key={imgChoice.label}
                      type="button"
                      onClick={() => setProdImage(imgChoice.url)}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all ${
                        prodImage === imgChoice.url ? 'border-[#1B5E20] ring-2 ring-[#1B5E20]/30' : 'border-stone-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgChoice.url} alt={imgChoice.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate">
                        {imgChoice.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label
                  onClick={() => setProdIsOrganic(!prodIsOrganic)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={prodIsOrganic}
                    onChange={() => setProdIsOrganic(!prodIsOrganic)}
                    className="rounded text-[#1B5E20] focus:ring-[#1B5E20]"
                  />
                  <span className="text-stone-700 font-semibold">Certified Organic & Pesticide-Free</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="px-5 py-2.5 bg-[#1B5E20] hover:bg-[#164d1a] text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    {savingProduct ? 'Saving...' : modalMode === 'add' ? 'Publish Listing' : 'Update Listing'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
