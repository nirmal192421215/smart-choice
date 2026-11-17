import { useState, useId } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useAdminStore';
import { useCart } from '../hooks/useStore';
import { PRODUCTS } from '../data/products';
import { formatCurrency, getDiscountPercentage } from '../utils/helpers';
import Keychain3D from '../components/common/Keychain3D';
import toast from 'react-hot-toast';
import {
  Radio,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  BadgePercent,
  Tag,
  Banknote,
  Eye,
  CheckCircle2,
  Compass,
  ArrowRight,
  HelpCircle,
  Cpu
} from 'lucide-react';
import type { ProductCategory } from '../types';

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { products } = useAdminProducts();

  const rawProduct = products.find((p) => p.slug === slug) || PRODUCTS.find((p) => p.slug === slug) || products[0];
  const staticProduct = PRODUCTS.find((p) => p.slug === (rawProduct?.slug || slug)) || PRODUCTS[0];
  const product = {
    ...staticProduct,
    ...rawProduct,
    galleryImages: (staticProduct?.galleryImages && staticProduct.galleryImages.length > 0)
      ? staticProduct.galleryImages
      : (rawProduct?.galleryImages || []),
  };

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const selectedVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const [galleryView, setGalleryView] = useState<'3d' | 'photo'>('photo');

  const galleryList = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [
        { src: product.images?.[0] || '', label: 'Front View', type: 'front' as const },
        { src: product.images?.[1] || product.images?.[0] || '', label: 'Back View', type: 'back' as const },
      ];

  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const activeGalleryItem = galleryList[selectedGalleryIndex] || galleryList[0];
  const [quantity, setQuantity] = useState(1);
  const [isTapSimulated, setIsTapSimulated] = useState(false);

  // NFC Customization state
  const [destinationUrl, setDestinationUrl] = useState('');
  const [destinationLabel, setDestinationLabel] = useState(product.category);
  const [customPhone, setCustomPhone] = useState('');
  const [customMessage, setCustomMessage] = useState('Hi! I tapped your Smart Choice keychain.');

  const price = product.salePrice && product.salePrice < product.price
    ? product.salePrice
    : product.price;

  const discount = product.salePrice
    ? getDiscountPercentage(product.price, product.salePrice)
    : 0;

  // Compute final destination URL based on type
  const getComputedUrl = () => {
    if (product.category === 'WhatsApp') {
      const cleanPhone = customPhone.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(customMessage);
      return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedMsg}` : 'https://wa.me/919342626096';
    }
    if (product.category === 'Instagram') {
      if (!destinationUrl) return 'https://instagram.com/yourhandle';
      return destinationUrl.startsWith('http')
        ? destinationUrl
        : `https://instagram.com/${destinationUrl.replace('@', '')}`;
    }
    return destinationUrl || 'https://example.com';
  };

  const handleAddToCart = (redirect = false) => {
    let finalUrl = getComputedUrl();

    // Allow adding to cart even if left empty (defaults to category portal)
    if (product.category === 'WhatsApp' && !customPhone) {
      finalUrl = 'https://wa.me/';
    } else if (product.category !== 'WhatsApp' && !destinationUrl) {
      finalUrl = product.category === 'Instagram'
        ? 'https://instagram.com'
        : product.category === 'Spotify'
        ? 'https://open.spotify.com'
        : 'https://smartchoice-store.vercel.app';
    }

    const cartItem = {
      id: `${product.id}-${selectedVariant.color}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: activeGalleryItem.src,
      price: product.price,
      salePrice: product.salePrice,
      quantity,
      color: selectedVariant.color,
      variantId: selectedVariant.sku,
      customDestinationType: product.category,
      customDestinationUrl: finalUrl,
      customDestinationLabel: destinationLabel || product.category,
      subtotal: price * quantity,
    };

    addItem(cartItem);
    toast.success(`Added ${product.name} to cart!`);

    if (redirect) {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A142F]">
      {/* ── Breadcrumb Bar ── */}
      <div className="border-b border-neutral-200/60 bg-white/70 backdrop-blur-md py-3 px-6 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
          <Link to="/" className="hover:text-[#0099ff] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#0099ff] transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0A142F] font-bold">{product.name}</span>
        </div>
      </div>

      {/* ── Main Product Stage ── */}
      <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-16 overflow-hidden">
        {/* Ambient background glow orbs */}
        <div className="absolute top-0 left-[10%] w-[450px] h-[450px] rounded-full bg-sky-300/25 blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-amber-200/30 blur-[110px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* ── LEFT COLUMN: Product Gallery & 3D Stage ── */}
          <div className="lg:col-span-6 space-y-4">
            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="inline-flex p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-neutral-200/70 shadow-xs">
                <button
                  type="button"
                  onClick={() => setGalleryView('3d')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    galleryView === '3d'
                      ? 'text-white shadow-md'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  style={galleryView === '3d' ? {
                    background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
                    boxShadow: '0 4px 16px rgba(0, 150, 255, 0.35)'
                  } : {}}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive 3D</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGalleryView('photo')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    galleryView === 'photo'
                      ? 'text-white shadow-md'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  style={galleryView === 'photo' ? {
                    background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
                    boxShadow: '0 4px 16px rgba(0, 150, 255, 0.35)'
                  } : {}}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Real Photos ({galleryList.length} Views)</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-[#0099ff] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 shadow-2xs">
                Signature 45° Diamond
              </span>
            </div>

            {/* Main Stage Glass Container */}
            <div className="glass-card relative aspect-square rounded-[36px] overflow-hidden flex items-center justify-center p-6 sm:p-8 shadow-sm border border-neutral-200/80 bg-white">
              {discount > 0 && (
                <span className="absolute top-4 left-4 z-20 bg-rose-500 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md">
                  SAVE {discount}%
                </span>
              )}

              <span className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md text-[#0A142F] text-xs font-bold px-3 py-1.5 rounded-full border border-neutral-200/80 shadow-xs flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#0099ff]" /> NTAG215 Embedded
              </span>

              {galleryView === '3d' ? (
                <div className="flex flex-col items-center justify-center relative w-full h-full">
                  {/* Glowing podium light orb behind diamond keychain */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
                  </div>
                  <div className="relative z-10 py-6">
                    <Keychain3D
                      category={product.category}
                      colorOverride={selectedVariant.colorHex}
                      size="hero"
                      interactive={true}
                    />
                  </div>
                  <p className="text-[11px] font-semibold text-[#64748B] mt-2 z-10 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#0099ff]" />
                    Move cursor to tilt and rotate 3D Diamond keychain
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={activeGalleryItem.src}
                    alt={`${product.name} - ${activeGalleryItem.label}`}
                    className="w-full h-full object-contain p-2 sm:p-4 transition-all duration-300 drop-shadow-md rounded-2xl"
                  />
                  
                  {/* Floating View Indicator Label at Bottom of image */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full backdrop-blur-md bg-neutral-900/85 text-white text-[11px] font-bold tracking-wide shadow-lg border border-white/20 flex items-center gap-2 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                    <span>{activeGalleryItem.label}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Bar - Real Keychain Photos Only */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Product Photos:
                </span>
                <span className="text-[11px] font-bold text-neutral-400">
                  {selectedGalleryIndex + 1} of {galleryList.length}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 overflow-x-auto pb-1">
                {/* Photo Gallery Thumbnails */}
                {galleryList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedGalleryIndex(idx);
                      setGalleryView('photo');
                    }}
                    className={`group relative rounded-2xl overflow-hidden border-2 transition-all flex flex-col items-center justify-between p-1 bg-white shadow-2xs aspect-square ${
                      galleryView === 'photo' && selectedGalleryIndex === idx
                        ? 'border-[#0099ff] ring-2 ring-[#0099ff]/30 shadow-md scale-102'
                        : 'border-neutral-200/90 hover:border-neutral-400'
                    }`}
                    title={item.label}
                  >
                    <div className="w-full flex-1 overflow-hidden rounded-xl bg-neutral-50 flex items-center justify-center p-0.5">
                      <img src={item.src} alt={item.label} className="w-full h-full object-contain" />
                    </div>
                    <span className={`text-[9.5px] font-bold tracking-tight text-center truncate w-full pt-1 ${
                      galleryView === 'photo' && selectedGalleryIndex === idx ? 'text-[#0099ff]' : 'text-neutral-600'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Highlights below gallery */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-200/60 text-center">
              <div className="glass-card p-3.5 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-[#0099ff] mx-auto mb-1" />
                <p className="text-[11px] font-black text-[#0A142F]">High-Density PLA</p>
                <p className="text-[10px] text-[#64748B]">Water &amp; drop resistant</p>
              </div>
              <div className="glass-card p-3.5 rounded-2xl">
                <Truck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-[11px] font-black text-[#0A142F]">Express Dispatch</p>
                <p className="text-[10px] text-[#64748B]">Shipped in 24 hours</p>
              </div>
              <div className="glass-card p-3.5 rounded-2xl">
                <RotateCcw className="w-5 h-5 text-violet-500 mx-auto mb-1" />
                <p className="text-[11px] font-black text-[#0A142F]">Pre-Tested Chip</p>
                <p className="text-[10px] text-[#64748B]">100% verified signal</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Customization & Purchase Configurator ── */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider text-white"
                  style={{ background: 'linear-gradient(90deg, #00d2ff, #0099ff)' }}>
                  <Radio className="w-3 h-3 text-white" />
                  {product.category} Edition
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-sky-800 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-full text-[11px] italic shadow-2xs">
                  Assured <span className="text-emerald-600 font-black not-italic">✓</span>
                </span>
                <span className="text-neutral-300">&bull;</span>
                <div className="flex items-center text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span>4.9 (128 ratings &amp; 42 reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-[#0A142F] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Flipkart / Amazon Special Price Box */}
              <div className="mt-3 p-4 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-sky-50/30 rounded-2xl border border-emerald-200/70 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Special Price
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">
                    Save ₹{product.price - price} ({discount}% off)
                  </span>
                </div>

                <div className="flex items-baseline flex-wrap gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#0A142F] tracking-tight">
                    {formatCurrency(price)}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="text-base sm:text-lg text-neutral-400 line-through font-semibold">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                  <span className="text-xs text-neutral-500 font-medium">
                    Inclusive of all taxes &bull; Free NFC Chip Encoding
                  </span>
                </div>
              </div>

              {/* Flipkart Style "Available Offers" Widget */}
              <div className="mt-4 p-4 bg-white rounded-2xl border border-neutral-200/80 space-y-2.5 shadow-2xs">
                <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-emerald-600" />
                  Available Offers
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-700">
                  <li className="flex items-start gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong className="text-neutral-900">UPI / QR Offer:</strong> Instant verification with PhonePe, Google Pay, Paytm &amp; all UPI apps.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong className="text-neutral-900">Special Price:</strong> Get 52% off today (Save ₹{product.price - price} directly on this item).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong className="text-neutral-900">Coupon Discount:</strong> Use code <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono font-bold text-brand-navy">FIRSTBUY</code> for ₹200 off on ₹500+ orders.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Truck className="w-3.5 h-3.5 text-brand-teal mt-0.5 shrink-0" />
                    <span><strong className="text-neutral-900">Free Express Delivery:</strong> Unlocked automatically on cart value above ₹499 across India.</span>
                  </li>
                </ul>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-[#475569] leading-relaxed font-medium">
                {product.description}
              </p>
            </div>



            {/* NFC Customization Card */}
            <div className="glass-card rounded-[28px] p-6 space-y-4 shadow-sm border border-white/95">
              <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #00d2ff, #0099ff)' }}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0A142F]">
                      Program Your NFC Chip
                    </h3>
                    <p className="text-[11px] text-[#64748B] font-medium">We write this to your keychain before shipping</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  Free Encoding
                </span>
              </div>

              {/* Dynamic inputs by category */}
              {product.category === 'WhatsApp' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0A142F] mb-1">
                      WhatsApp Mobile Number (with country code)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 93426 26096"
                      value={customPhone}
                      onChange={(e) => setCustomPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/90 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:border-[#0099ff] shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0A142F] mb-1">
                      Pre-filled Chat Message (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hi! Found you through your Smart Choice keychain."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-white/90 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:border-[#0099ff] shadow-xs"
                    />
                  </div>
                </div>
              ) : product.category === 'Instagram' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0A142F] mb-1">
                      Instagram Username or Profile Link
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. @yourhandle or https://instagram.com/yourhandle"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-white/90 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:border-[#0099ff] shadow-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0A142F] mb-1">
                      {product.category} Profile URL or Link
                    </label>
                    <input
                      type="url"
                      placeholder={`https://your-${product.category.toLowerCase()}-link.com`}
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-white/90 border border-neutral-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:border-[#0099ff] shadow-xs"
                    />
                  </div>
                </div>
              )}

              {/* Live Tap Preview Banner */}
              <div className="p-3.5 bg-white/95 rounded-2xl border border-neutral-200/80 text-xs flex items-center justify-between shadow-2xs">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] block">Tap Destination Result:</span>
                  <span className="font-mono text-[#0A142F] truncate block font-bold text-[11px] mt-0.5">
                    {getComputedUrl()}
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-bold shrink-0 shadow-2xs">
                  Active
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-neutral-200 rounded-2xl bg-white px-3 py-2 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-neutral-500 hover:text-black font-black px-2 text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-black text-[#0A142F]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-neutral-500 hover:text-black font-black px-2 text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 py-4 px-6 rounded-full font-bold text-white text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
                    boxShadow: '0 8px 24px rgba(0, 150, 255, 0.35)'
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart &bull; {formatCurrency(price * quantity)}</span>
                </button>
              </div>

              {/* Instant Buy button */}
              <button
                onClick={() => handleAddToCart(true)}
                className="w-full py-4 px-6 bg-[#0A142F] hover:bg-neutral-800 text-white font-bold rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-xs"
              >
                Instant Buy Now
              </button>
            </div>

            {/* Specifications Box */}
            <div className="border-t border-neutral-200/60 pt-6 space-y-3 text-xs">
              <h4 className="font-black text-[#0A142F] uppercase tracking-wider text-[11px]">
                Product Specifications
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[#475569] glass-card p-4 rounded-2xl font-medium">
                <div><strong className="text-[#0A142F]">NFC Chip:</strong> NTAG215 (High Frequency)</div>
                <div><strong className="text-[#0A142F]">Compatibility:</strong> iPhone &amp; Android</div>
                <div><strong className="text-[#0A142F]">Read Range:</strong> 0 - 4 cm instant tap</div>
                <div><strong className="text-[#0A142F]">Rewritable:</strong> Yes (via NFC Tools app)</div>
                <div><strong className="text-[#0A142F]">Dimensions:</strong> 35mm x 35mm x 5mm</div>
                <div><strong className="text-[#0A142F]">Material:</strong> Matte 3D Printed PLA</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: HOW IT WORKS (Interactive Visual Explainer) ── */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-[#0099ff] bg-blue-50 border border-blue-200/60 mb-3 shadow-2xs">
              <Zap className="w-3.5 h-3.5" /> Tap &amp; Connect Technology
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A142F] tracking-tight">
              How Every Smart Choice Keychain Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B] font-medium">
              Zero apps required for the other person. Works automatically on both iPhones and modern Androids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="glass-card rounded-[28px] p-6 sm:p-8 bg-white border border-neutral-200/80 shadow-sm relative group hover:border-[#0099ff] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/80 flex items-center justify-center font-black text-lg mb-5 shadow-2xs group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-base font-black text-[#0A142F] mb-2 flex items-center gap-2">
                <span>Hold Near Phone</span>
                <Smartphone className="w-4 h-4 text-[#0099ff]" />
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Simply hold your diamond keychain within 0 to 4 cm of the back of any smartphone.
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] font-bold text-sky-700">
                <Check className="w-3.5 h-3.5 text-sky-500" />
                <span>iPhone: Top edge &bull; Android: Center/back</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-[28px] p-6 sm:p-8 bg-white border border-neutral-200/80 shadow-sm relative group hover:border-violet-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 border border-violet-200/80 flex items-center justify-center font-black text-lg mb-5 shadow-2xs group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-base font-black text-[#0A142F] mb-2 flex items-center gap-2">
                <span>Instant NFC Detection</span>
                <Radio className="w-4 h-4 text-violet-500" />
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                The phone immediately powers the internal NTAG215 microchip via wireless induction in under 0.1s.
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] font-bold text-violet-700">
                <Check className="w-3.5 h-3.5 text-violet-500" />
                <span>100% Passive &bull; No battery or charging</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-[28px] p-6 sm:p-8 bg-white border border-neutral-200/80 shadow-sm relative group hover:border-emerald-400 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center font-black text-lg mb-5 shadow-2xs group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-base font-black text-[#0A142F] mb-2 flex items-center gap-2">
                <span>Direct Destination Opens</span>
                <ExternalLink className="w-4 h-4 text-emerald-500" />
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                A native push notification prompts the recipient to open your {product.category} profile or link right away.
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2 text-[11px] font-bold text-emerald-700">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero app download required for receiver</span>
              </div>
            </div>
          </div>

          {/* Interactive Tap Simulator */}
          <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-sky-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
                <Radio className="w-6 h-6 text-[#00d2ff] animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base">Experience The Tap Right Now</h4>
                <p className="text-xs text-sky-200 mt-0.5">
                  Click the button to test the simulated NFC tap handshake with your programmed link.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setIsTapSimulated(true);
                  toast.success(`⚡ NFC Tap Triggered! Opened ${getComputedUrl()}`, {
                    icon: '🚀',
                    duration: 4000,
                  });
                }}
                className="w-full md:w-auto px-6 py-3 rounded-full text-xs font-black bg-gradient-to-r from-[#00d2ff] to-[#0099ff] hover:opacity-90 active:scale-95 transition-all shadow-md text-white flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Test Live Tap Simulation</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: CRAFTSMANSHIP & KEYCHAIN GALLERY ── */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 mb-3 shadow-2xs">
              <Compass className="w-3.5 h-3.5" /> Premium Build Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A142F] tracking-tight">
              Craftsmanship &amp; Everyday Carry
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#64748B] font-medium">
              Every detail engineered for aesthetics, pocket comfort, and reliable contactless performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Front View Card */}
            <div className="glass-card rounded-[28px] overflow-hidden bg-white border border-neutral-200/80 shadow-sm flex flex-col">
              <div className="relative aspect-square bg-neutral-100 flex items-center justify-center p-4 overflow-hidden group">
                <img
                  src={galleryList[0]?.src || product.images[0]}
                  alt="Front Side View"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Front Side
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0A142F]">3D Embossed Logo</h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Vibrant dual-color embossed emblem with signature 45° diamond geometry. Crisp tactile relief.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] font-bold text-sky-700">
                  Dual-layer high precision PLA
                </div>
              </div>
            </div>

            {/* Instant Tap Demo Card */}
            <div className="glass-card rounded-[28px] overflow-hidden bg-white border border-neutral-200/80 shadow-sm flex flex-col">
              <div className="relative aspect-square bg-neutral-100 flex items-center justify-center p-4 overflow-hidden group">
                <img
                  src="/images/phone_tap_nfc.jpg"
                  alt="Instant NFC Tap"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Instant Tap
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0A142F]">Instant Contactless Tap</h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Tap against the top of iPhone or center of Android. Opens your customized link in under 0.1 seconds.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] font-bold text-emerald-700">
                  Zero app download &bull; Instant read
                </div>
              </div>
            </div>

            {/* Everyday Carry Card (Newly Uploaded Photo!) */}
            <div className="glass-card rounded-[28px] overflow-hidden bg-white border border-neutral-200/80 shadow-sm flex flex-col">
              <div className="relative aspect-square bg-neutral-100 flex items-center justify-center p-4 overflow-hidden group">
                <img
                  src="/images/woman_tote_keychain.jpg"
                  alt="Everyday Carry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Everyday Carry
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0A142F]">Keys, Bags &amp; Handbags</h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Comes with a heavy-duty stainless steel split ring. Securely attaches to handbags, backpacks, or keychains.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] font-bold text-amber-700">
                  Stylish accessory &bull; 8 grams
                </div>
              </div>
            </div>

            {/* Collection Card */}
            <div className="glass-card rounded-[28px] overflow-hidden bg-white border border-neutral-200/80 shadow-sm flex flex-col">
              <div className="relative aspect-square bg-neutral-100 flex items-center justify-center p-4 overflow-hidden group">
                <img
                  src="/images/real_batch_keychains.png"
                  alt="Keychain Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Collection
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0A142F]">All Custom Apps Available</h4>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Choose from Instagram, WhatsApp, Spotify, YouTube, Websites, and more. Each programmed individually.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] font-bold text-[#0099ff]">
                  Free encoding included
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: EXPLORE OTHER KEYCHAINS ── */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-neutral-200/80">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0A142F] tracking-tight">
                Explore Other Smart Choice Editions
              </h3>
              <p className="text-xs text-[#64748B] font-medium mt-1">
                Each edition customized with dedicated NFC encoding for your favorite app
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#0099ff] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {PRODUCTS.filter((p) => p.slug !== product.slug).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="group p-3 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#0099ff] hover:shadow-md transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-neutral-50 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                  <img src={p.galleryImages?.[0]?.src || p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] font-black text-[#0A142F] mt-2 line-clamp-1 group-hover:text-[#0099ff] transition-colors">
                  {p.category}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 mt-0.5">
                  ₹{p.salePrice || p.price}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProductDetail;
