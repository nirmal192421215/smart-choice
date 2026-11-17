import { useState } from 'react';
import { useOrders } from '../hooks/useStore';
import { useAdminAuth, useAdminProducts, useAdminDestinations, useAdminPaymentSettings } from '../hooks/useAdminStore';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  TrendingUp,
  Package,
  Layers,
  Radio,
  Tag,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Sparkles,
  ShoppingBag,
  Sliders,
  DollarSign,
  Search,
  QrCode,
  Check,
  Save,
  MessageCircle,
  Smartphone,
  Info
} from 'lucide-react';
import type { OrderStatus } from '../types';
import type { ProductExtended } from '../data/products';
import { AdminProductFormModal } from '../components/admin/AdminProductFormModal';
import { AdminDestinations } from '../components/admin/AdminDestinations';
import { AdminPricingCoupons } from '../components/admin/AdminPricingCoupons';

export const Admin = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { adminEmail, logout } = useAdminAuth();
  const { products, addProduct, updateProduct, deleteProduct, toggleProductStock } =
    useAdminProducts();
  const { destinations } = useAdminDestinations();
  const { settings: paymentSettings, updateSettings: updatePaymentSettings } = useAdminPaymentSettings();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'destinations' | 'pricing' | 'payment'>('orders');
  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductExtended | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Local state for payment settings form
  const [localPaymentSettings, setLocalPaymentSettings] = useState(paymentSettings);

  // Revenue analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Confirmed' || o.status === 'Processing').length;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Updated order ${orderId} to ${newStatus}`);
  };

  const handleSaveProduct = (productData: ProductExtended) => {
    if (selectedProduct) {
      updateProduct(productData.id, productData);
      toast.success(`Updated "${productData.name}"!`);
    } else {
      addProduct(productData);
      toast.success(`Added new product "${productData.name}"!`);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-100/60 text-brand-navy py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Navbar / Header */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center text-brand-teal shadow-md shadow-brand-navy/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal">
                  Smart Choice Seller Central
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-brand-navy">
                Admin Control Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-brand-navy block">Nirmal kumar N</span>
              <span className="text-[11px] text-neutral-400 font-mono">{adminEmail || 'Owner'}</span>
            </div>
            <button
              onClick={() => {
                if (confirm('Logout from Admin Portal?')) {
                  logout();
                  toast.success('Logged out successfully');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-600 text-xs font-bold flex items-center gap-1.5 transition-colors border border-neutral-200"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Analytics Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Total Revenue</span>
            <p className="text-2xl font-extrabold text-brand-navy">{formatCurrency(totalRevenue)}</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Live transactions
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Total Orders</span>
            <p className="text-2xl font-extrabold text-brand-navy">{orders.length}</p>
            <p className="text-[11px] text-neutral-500">Customer checkouts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Pending Encoding</span>
            <p className="text-2xl font-extrabold text-amber-600">{pendingOrders}</p>
            <p className="text-[11px] text-neutral-500">NFC tags to write</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Active SKUs</span>
            <p className="text-2xl font-extrabold text-brand-teal">{products.length}</p>
            <p className="text-[11px] text-neutral-500">{destinations.filter(d => d.isActive).length} NFC platforms</p>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex border-b border-neutral-200 gap-2 sm:gap-4 overflow-x-auto pb-1 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-neutral-500 hover:text-brand-navy hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" /> Orders & NFC Chips ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'products'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-neutral-500 hover:text-brand-navy hover:bg-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Products & Images ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'destinations'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-neutral-500 hover:text-brand-navy hover:bg-white'
            }`}
          >
            <Radio className="w-4 h-4" /> Tap Destinations ({destinations.length})
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'pricing'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-neutral-500 hover:text-brand-navy hover:bg-white'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Bulk Pricing & Coupons
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'payment'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-neutral-500 hover:text-brand-navy hover:bg-white'
            }`}
          >
            <QrCode className="w-4 h-4" /> Payment & QR Settings
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-brand-navy">
                  Customer Orders & Custom NFC Destinations
                </h3>
                <p className="text-xs text-neutral-400">
                  Every order includes the customer-entered URL to write to the physical NTAG215 chip
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-brand-teal rounded-lg">
                Real-time Sync
              </span>
            </div>

            {orders.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {orders.map((o) => (
                  <div key={o.id} className="p-6 space-y-4 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-brand-navy">{o.orderNumber}</span>
                          {o.paymentMethod === 'upi_qr' ? (
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px]">
                              UPI QR
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-bold text-[10px]">
                              COD
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {new Date(o.createdAt).toLocaleString()} &bull;{' '}
                          {o.paymentMethod === 'upi_qr' ? (
                            <span>
                              UTR:{' '}
                              <strong className="font-mono text-brand-navy">
                                {o.upiTransactionId || 'Pending'}
                              </strong>
                            </span>
                          ) : (
                            'Pay on Delivery'
                          )}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Payment Verification Status for UPI */}
                        {o.paymentMethod === 'upi_qr' && (
                          <div>
                            {o.paymentStatus === 'captured' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200/80">
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Payment Verified
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  updateOrderStatus(o.id, o.status, 'captured');
                                  toast.success(`Order ${o.orderNumber} payment marked as Verified!`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Verify Payment
                              </button>
                            )}
                          </div>
                        )}

                        <span className="font-extrabold text-sm text-brand-navy">
                          {formatCurrency(o.totalAmount)}
                        </span>
                        {/* Status selector */}
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className="bg-neutral-100 border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-bold text-brand-navy focus:ring-2 focus:ring-brand-teal/20"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing (Encoding)</option>
                          <option value="Ready to Ship">Ready to Ship</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Destination Details */}
                    <div className="bg-neutral-50 rounded-2xl p-4 text-xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-neutral-600 gap-1">
                        <span>
                          <strong>Recipient:</strong> {o.shippingAddress.name} ({o.shippingAddress.mobile})
                        </span>
                        <span>
                          <strong>City:</strong> {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pinCode}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-neutral-200/60 space-y-1">
                        <span className="font-bold text-brand-navy text-[11px] uppercase tracking-wider">
                          NFC Chips to Program:
                        </span>
                        {o.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] bg-white p-2.5 rounded-xl border border-neutral-200 gap-2"
                          >
                            <span className="font-semibold text-brand-navy">
                              {item.name} ({item.color}) x{item.quantity}
                            </span>
                            <span className="font-mono text-brand-teal font-bold select-all bg-teal-50 px-2 py-0.5 rounded">
                              {item.customDestinationUrl || 'No custom URL specified'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-xs text-neutral-400">
                No orders yet. When a customer orders on the store, it will appear here for chip programming.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-neutral-200/90 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search keychains by name, category, or slug..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs focus:border-brand-teal outline-none"
                />
              </div>

              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Add New Keychain
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex gap-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-neutral-100 border border-neutral-200 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/keychains/spotify_nfc_keychain.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-brand-teal">
                          {prod.category}
                        </span>
                        {prod.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-navy/10 text-brand-navy">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-brand-navy truncate mt-0.5">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-extrabold text-brand-teal">
                          {formatCurrency(prod.salePrice || prod.price)}
                        </span>
                        {prod.salePrice && prod.salePrice < prod.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatCurrency(prod.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 line-clamp-2">{prod.description}</p>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleProductStock(prod.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                        prod.inStock
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                      }`}
                    >
                      {prod.inStock ? `${prod.stock} in stock` : 'Out of stock'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(prod);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-brand-navy font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete product "${prod.name}"?`)) {
                            deleteProduct(prod.id);
                            toast.success(`Deleted ${prod.name}`);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TAP DESTINATIONS */}
        {activeTab === 'destinations' && <AdminDestinations />}

        {/* TAB 4: BULK PRICING & COUPONS */}
        {activeTab === 'pricing' && <AdminPricingCoupons />}

        {/* TAB 5: PAYMENT & QR SETTINGS */}
        {activeTab === 'payment' && (
          <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-8 animate-fade-in">
            <div className="border-b border-neutral-100 pb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-teal block mb-1">
                ONLINE PAYMENT GATEWAY &amp; QR
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-brand-navy">
                UPI QR &amp; Payment Settings
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Customize your UPI ID, Business Payee Name, and QR Code that customers scan during checkout.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Settings */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Your UPI ID *
                  </label>
                  <input
                    type="text"
                    value={localPaymentSettings.upiId}
                    onChange={(e) =>
                      setLocalPaymentSettings({ ...localPaymentSettings, upiId: e.target.value.trim() })
                    }
                    placeholder="e.g. 9342626096@upi or 9342626096@okaxis"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Payments will be credited directly to this UPI ID (Google Pay, PhonePe, Paytm, BHIM).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Business Payee Name *
                  </label>
                  <input
                    type="text"
                    value={localPaymentSettings.payeeName}
                    onChange={(e) =>
                      setLocalPaymentSettings({ ...localPaymentSettings, payeeName: e.target.value })
                    }
                    placeholder="e.g. Smart Choice (Nirmal kumar N)"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Notification WhatsApp / Phone Number *
                  </label>
                  <input
                    type="text"
                    value={localPaymentSettings.phone}
                    onChange={(e) =>
                      setLocalPaymentSettings({ ...localPaymentSettings, phone: e.target.value })
                    }
                    placeholder="e.g. 9342626096"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Customers will be provided with a 1-click button to share payment UTR directly to this WhatsApp.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Custom QR Code Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={localPaymentSettings.qrImageUrl || ''}
                    onChange={(e) =>
                      setLocalPaymentSettings({ ...localPaymentSettings, qrImageUrl: e.target.value.trim() })
                    }
                    placeholder="Leave blank to use auto-generated dynamic UPI QR code"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Optional: If you have an official merchant QR image from PhonePe or Google Pay, paste its URL here.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Customer Payment Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={localPaymentSettings.instructions}
                    onChange={(e) =>
                      setLocalPaymentSettings({ ...localPaymentSettings, instructions: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      updatePaymentSettings(localPaymentSettings);
                      toast.success('Payment & QR settings updated successfully!');
                    }}
                    className="px-6 py-3 bg-brand-navy hover:bg-[#163259] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4 text-brand-teal" />
                    <span>Save Payment Settings</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live QR Preview */}
              <div className="lg:col-span-5 bg-gradient-to-br from-neutral-50 via-teal-50/20 to-sky-50/20 p-6 rounded-3xl border border-neutral-200 flex flex-col items-center text-center space-y-4">
                <span className="text-[10px] uppercase font-black text-brand-teal tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60">
                  LIVE CUSTOMER PREVIEW
                </span>

                <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-neutral-200/90">
                  <img
                    src={
                      localPaymentSettings.qrImageUrl ||
                      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(
                        `upi://pay?pa=${localPaymentSettings.upiId}&pn=${encodeURIComponent(localPaymentSettings.payeeName)}&cu=INR`
                      )}`
                    }
                    alt="Smart Choice Live QR Code"
                    className="w-48 h-48 object-contain rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-brand-navy">
                    {localPaymentSettings.payeeName}
                  </h4>
                  <p className="text-xs font-mono font-bold text-neutral-600 bg-white px-3 py-1 rounded-lg border border-neutral-200 inline-block">
                    {localPaymentSettings.upiId}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Phone / WhatsApp: +91 {localPaymentSettings.phone}
                  </p>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-neutral-200 text-[11px] text-neutral-500 text-left flex items-start gap-2">
                  <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                  <span>
                    This QR code is generated using standard NPCI UPI specifications. Customers scanning with GPay, PhonePe, Paytm, CRED or BHIM will immediately see your business name and auto-filled amount.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      <AdminProductFormModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default Admin;
