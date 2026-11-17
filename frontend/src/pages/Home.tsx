import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Radio,
  Share2,
  Smartphone,
  ShieldCheck,
  Star,
  ExternalLink,
  Heart,
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
  X,
  Layers,
  Zap,
  Link2,
  Gift,
  Check,
} from 'lucide-react';
import { CATEGORIES, type ProductExtended } from '../data/products';
import { useAdminProducts } from '../hooks/useAdminStore';
import ProductCard from '../components/product/ProductCard';
import Keychain3D from '../components/common/Keychain3D';
import QuotePopup from '../components/common/QuotePopup';
import toast from 'react-hot-toast';

const HERO_PHOTO_MAP: Record<string, string> = {
  Spotify: '/images/photos/spotify_real_keychain_clean.png',
  Instagram: '/images/photos/instagram_real_keychain.jpg',
  Portfolio: '/images/photos/portfolio_real_keychain.jpg',
  Website: '/images/photos/website_real_keychain.jpg',
  YouTube: '/images/photos/youtube_real_keychain.jpg',
  Facebook: '/images/photos/facebook_real_keychain.jpg',
  WhatsApp: '/images/photos/whatsapp_real_keychain.jpg',
  Telegram: '/images/photos/telegram_real_keychain.jpg',
  X: '/images/photos/x_real_keychain.jpg',
};

export const Home = () => {
  const navigate = useNavigate();
  const { products } = useAdminProducts();
  const [activeSimApp, setActiveSimApp] = useState<string>('Spotify');
  const [selectedHeroPlatform, setSelectedHeroPlatform] = useState<string>('Spotify');
  const [heroViewMode, setHeroViewMode] = useState<'photo' | '3d'>('photo');
  const [isTapping, setIsTapping] = useState(false);
  const [tapSuccess, setTapSuccess] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [quotePopupOpen, setQuotePopupOpen] = useState(false);

  // Auto-open the quote popup once per session, after the visitor has
  // had a moment to see the page.
  useEffect(() => {
    const KEY = 'sc_quote_popup_seen';
    if (sessionStorage.getItem(KEY)) return;
    const timer = setTimeout(() => {
      setQuotePopupOpen(true);
      sessionStorage.setItem(KEY, '1');
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Handle simulated tap on phone preview
  const handleAppSelect = (appName: string) => {
    setActiveSimApp(appName);
    setIsTapping(true);
    setTimeout(() => {
      setIsTapping(false);
      setTapSuccess(true);
      setTimeout(() => setTapSuccess(false), 3000);
    }, 600);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('Thank you for subscribing! Check your inbox for 10% off.');
    setNewsletterEmail('');
  };

  const bestSellers = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0b1f3a] font-sans antialiased overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════
          ⚡ ELECTRIC GRADIENT HERO — Stripe/Vercel World-Class Level
          Full animations: floating keychains, NFC ripple, glassmorphism,
          sparkle particles, review badge, gradient shift background
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="hero-option3-bg relative w-full overflow-hidden border-b border-white/60 min-h-[calc(100vh-102px)] lg:h-[calc(100vh-102px)] lg:max-h-[calc(100vh-102px)] flex flex-col justify-between">

        {/* ── Soft ambient glow orbs behind content ── */}
        <div className="absolute top-[-80px] left-[15%] w-[450px] h-[450px] rounded-full bg-sky-300/25 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[10%] w-[500px] h-[500px] rounded-full bg-amber-200/30 blur-[110px] pointer-events-none" />

        {/* ══════ MAIN HERO CONTENT ══════ */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center justify-center">

          {/* ── MOBILE HERO (< lg): Perfectly fitted to mobile screen with 3D keychains front & center ── */}
          <div className="w-full flex flex-col items-center text-center pt-2 pb-2 lg:hidden">
            {/* Top Pill Badge */}
            <div className="mb-1.5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.14em] uppercase text-white shadow-xs"
                style={{ background: 'linear-gradient(90deg, #00d2ff, #0099ff)' }}
              >
                <Radio className="w-3 h-3 text-white" />
                SMART NFC KEYCHAINS
              </span>
            </div>

            {/* Punchy Headline */}
            <h1 className="text-2xl xs:text-[28px] font-black tracking-tight leading-[1.12] text-[#0A142F] mb-1">
              Your Digital World.<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #0084ff 0%, #00d2ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                One Tap Away.
              </span>
            </h1>

            {/* Crisp Subtitle */}
            <p className="text-[11.5px] xs:text-xs text-[#475569] leading-snug max-w-[310px] font-medium mb-2">
              Connect to your phone with a single tap. Share Instagram, WhatsApp, Spotify &amp; more instantly.
            </p>

            {/* Sized-to-Fit 3D Phone & Floating Keychains Constellation Art */}
            <div className="relative w-full max-w-[310px] xs:max-w-[340px] my-1 flex items-center justify-center animate-hero-float-gentle">
              {/* Soft ambient backlight glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-52 h-52 rounded-full bg-cyan-400/25 blur-2xl animate-pulse" />
                <div className="w-56 h-56 rounded-full bg-amber-200/25 blur-2xl" />
              </div>

              <img
                src="/images/hero_constellation_merged.png"
                alt="Smart Choice 4K NFC Keychains Constellation"
                className="w-full h-auto max-h-[220px] xs:max-h-[250px] object-contain select-none relative z-10"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 65%, transparent 98%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 65%, transparent 98%)',
                }}
                loading="eager"
              />
            </div>

            {/* Dual Action Buttons */}
            <div className="flex items-center justify-center gap-2.5 w-full mt-2 mb-2.5">
              <Link
                to="/shop"
                className="flex-1 max-w-[165px] py-2.5 px-4 rounded-full font-black text-xs text-white flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
                style={{
                  background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
                  boxShadow: '0 6px 18px rgba(0, 150, 255, 0.35)',
                }}
              >
                <span>Shop Keychains</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setVideoModalOpen(true)}
                className="flex-1 max-w-[150px] py-2.5 px-3 rounded-full font-bold text-xs text-[#0A142F] bg-white/90 border border-neutral-200/90 shadow-2xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
              >
                <div className="w-4 h-4 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                  <Play className="w-2 h-2 fill-white text-white ml-0.5" />
                </div>
                <span>How It Works</span>
              </button>
            </div>

            {/* Sleek 4-Pill Feature Micro-Grid */}
            <div className="grid grid-cols-2 gap-1.5 w-full max-w-[340px]">
              {[
                { icon: <Radio className="w-3 h-3 text-[#0099ff]" />, label: 'NFC Enabled' },
                { icon: <Zap className="w-3 h-3 text-amber-500" />, label: 'Instant Sharing' },
                { icon: <Sparkles className="w-3 h-3 text-[#0099ff]" />, label: 'Premium 3D Print' },
                { icon: <Truck className="w-3 h-3 text-emerald-500" />, label: 'Free Shipping ₹499+' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/80 border border-white/90 shadow-2xs backdrop-blur-xs text-left"
                >
                  {f.icon}
                  <span className="text-[10px] font-bold text-[#0A142F] truncate">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── DESKTOP HERO (lg+): Full 2-Column Stately Layout ── */}
          <div className="hidden lg:grid w-full grid-cols-12 gap-8 items-center py-6">

            {/* ── LEFT: Glassmorphism Frosted White Card ── */}
            <div className="lg:col-span-5 relative">
              <div
                className="relative rounded-[32px] p-7 xl:p-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.84)',
                  backdropFilter: 'blur(30px)',
                  WebkitBackdropFilter: 'blur(30px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 20px 50px rgba(70, 95, 145, 0.12), 0 2px 8px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1)',
                }}
              >
                {/* Badge */}
                <div className="mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold tracking-[0.16em] uppercase text-white shadow-sm"
                    style={{ background: 'linear-gradient(90deg, #00d2ff, #0099ff)' }}
                  >
                    <Radio className="w-3 h-3 text-white" />
                    SMART NFC KEYCHAINS
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl lg:text-[2.5rem] xl:text-[2.85rem] font-black tracking-tight leading-[1.08] text-[#0A142F] mb-3">
                  Your Digital World.<br />
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #0084ff 0%, #00d2ff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    One Tap Away.
                  </span>
                </h1>

                {/* Description */}
                <p className="text-[13px] text-[#475569] leading-relaxed mb-4 max-w-sm font-medium">
                  Smart NFC keychains connect to your phone with a single tap. Share Instagram, WhatsApp, Spotify, Portfolio, YouTube &amp; more instantly — no app needed.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 mb-5">
                  <Link
                    to="/shop"
                    className="group px-6 py-3 rounded-full font-bold text-[13px] text-white flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
                      boxShadow: '0 8px 24px rgba(0, 150, 255, 0.35)',
                    }}
                  >
                    <span>Shop Keychains</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="px-5 py-3 rounded-full font-bold text-[13px] text-[#0A142F] flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.98]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                      <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                    </div>
                    <span>See How It Works</span>
                  </button>

                  <button
                    onClick={() => setQuotePopupOpen(true)}
                    className="px-5 py-3 rounded-full font-black text-[13px] text-white flex items-center gap-2 transition-all hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: 'linear-gradient(90deg, #24B8A6, #1a9488)',
                      boxShadow: '0 8px 24px rgba(36, 184, 166, 0.35)',
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Get Free Quote</span>
                  </button>
                </div>

                {/* 2x2 Feature Chips */}
                <div className="border-t border-neutral-200/60 pt-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { icon: <Radio className="w-3.5 h-3.5" />, label: 'NFC Enabled', sub: 'All modern phones' },
                      { icon: <Zap className="w-3.5 h-3.5" />, label: 'Instant Sharing', sub: 'Zero app needed' },
                      { icon: <Sparkles className="w-3.5 h-3.5" />, label: 'Premium 3D Print', sub: 'Matte diamond finish' },
                      { icon: <Gift className="w-3.5 h-3.5" />, label: 'Perfect Gift', sub: 'For any occasion' },
                    ].map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          border: '1px solid rgba(255, 255, 255, 0.85)',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[#0099ff]"
                          style={{ background: 'rgba(0, 180, 255, 0.12)' }}
                        >
                          {f.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10.5px] font-bold text-[#0A142F] leading-tight truncate">{f.label}</p>
                          <p className="text-[9px] text-[#64748B] leading-tight mt-0.5 truncate">{f.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: 3D Rendered Phone & Floating Keychains Constellation ── */}
            <div className="lg:col-span-7 relative flex items-center justify-center">
              {/* Luminous soft ambient glow orbs behind the phone */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[380px] h-[380px] rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
                <div className="w-[420px] h-[420px] rounded-full bg-amber-200/25 blur-3xl" />
              </div>

              {/* 4K Ultra-HD Constellation Scene */}
              <div className="relative z-10 w-full max-w-[620px] flex items-center justify-center animate-hero-float-gentle">
                <img
                  src="/images/hero_constellation_merged.png"
                  alt="Smart Choice 4K NFC Keychains Constellation"
                  className="w-full h-auto max-h-[500px] lg:max-h-[540px] xl:max-h-[570px] object-contain select-none transition-transform duration-500 hover:scale-[1.02]"
                  style={{
                    imageRendering: '-webkit-optimize-contrast',
                    maskImage: 'radial-gradient(ellipse 84% 84% at 50% 50%, black 62%, transparent 98%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 84% 84% at 50% 50%, black 62%, transparent 98%)',
                  }}
                  loading="eager"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── Feature badges strip at the very bottom ── */}
        <div
          className="shrink-0 relative z-10 border-t border-white/60"
          style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-wrap justify-center sm:justify-between gap-3 sm:gap-4">
            {[
              { icon: <Radio className="w-3.5 h-3.5 text-[#0099ff]" />, label: 'Works with NFC Phones' },
              { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, label: 'No App Required' },
              { icon: <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />, label: 'Fast & Secure' },
              { icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />, label: 'Customised for You' },
              { icon: <Truck className="w-3.5 h-3.5 text-sky-500" />, label: 'Free Shipping ₹499+' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                {b.icon}
                <span className="text-[11px] font-bold text-[#0B1528]">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: EXPLORE BY APP (Matching Image 1 Row)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-neutral-400 block mb-1">
                EXPLORE BY APP
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0b1f3a]">
                Choose Your Keychain
              </h2>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-brand-teal transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 7+ App Category Cards with 3D Keychains matching mockup */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {CATEGORIES.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                to={`/product/${cat.slug}`}
                className="group relative pt-4 pb-3.5 px-3 rounded-3xl bg-white border border-neutral-200/80 hover:border-[#24B8A6]/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[185px] overflow-hidden"
              >
                {/* Subtle colored glow behind keychain on hover */}
                <div
                  className="absolute top-10 w-20 h-20 rounded-full opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: cat.color }}
                />

                {/* Real Keychain Photo Render */}
                <div className="w-full flex items-center justify-center my-1 z-10 h-20">
                  {HERO_PHOTO_MAP[cat.name] ? (
                    <img
                      src={HERO_PHOTO_MAP[cat.name]}
                      alt={cat.name}
                      className="w-16 h-16 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <Keychain3D category={cat.name} size="sm" withChain={true} />
                  )}
                </div>

                <div className="w-full mt-1.5 z-10">
                  <h3 className="text-xs font-black text-[#0b1f3a] tracking-tight truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-medium truncate mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Circular Arrow Button */}
                <div className="mt-2 w-6 h-6 rounded-full bg-neutral-100 group-hover:bg-[#0b1f3a] text-neutral-400 group-hover:text-white flex items-center justify-center transition-all z-10 shadow-xs">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: HOW IT WORKS (3 Simple Steps matching Image 1)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-[#F8FAFC] to-white border-b border-neutral-100 relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left title & benefits */}
            <div className="lg:col-span-4 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/70 text-[#0d9488] text-[11px] font-extrabold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#24B8A6] animate-pulse" />
                <span>How It Works</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0b1f3a] leading-[1.15] tracking-tight">
                Three Simple Steps
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed">
                Set up your Smart Choice NFC keychain in minutes and start sharing your digital world effortlessly.
              </p>

              {/* Quick Benefits Checklist */}
              <div className="space-y-2 pt-1 text-xs text-neutral-700 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Zero apps or battery needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Native tap on 99% of smartphones</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Update your link anytime for free</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#0b1f3a] to-[#163259] hover:from-[#163259] hover:to-[#0b1f3a] text-white rounded-full text-xs font-bold shadow-lg shadow-[#0b1f3a]/15 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right 3 Stepper Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Step 01 */}
              <div className="group relative p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(11,31,58,0.08)] hover:border-[#24B8A6]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0b1f3a] to-[#1e3a66] text-white text-xs font-black flex items-center justify-center shadow-xs">
                    01
                  </span>
                  <span className="text-[10px] font-extrabold text-neutral-400 tracking-wider uppercase bg-neutral-100/80 px-2 py-0.5 rounded-full">
                    Step 1
                  </span>
                </div>

                {/* Real Diamond Keychain Stage */}
                <div className="h-36 py-2 flex items-center justify-center relative">
                  {/* Radiant background glow */}
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-400/15 blur-xl group-hover:bg-emerald-400/30 group-hover:scale-125 transition-all duration-500" />
                  
                  {/* Real studio photograph of physical diamond keychain */}
                  <img
                    src="/images/photos/spotify_real_keychain_clean.png"
                    alt="Physical Spotify NFC Diamond Keychain"
                    className="w-24 h-28 object-contain filter drop-shadow-[0_10px_18px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10"
                    loading="lazy"
                  />

                  {/* Micro pill badge */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-center z-10">
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
                      <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                      Diamond PLA
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-bold text-[#0b1f3a] group-hover:text-[#0d9488] transition-colors">
                    Choose Your Style
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Pick your favourite keychain design, platform (Spotify, Instagram, WhatsApp) and PLA color.
                  </p>
                </div>
              </div>

              {/* Step 02 */}
              <div className="group relative p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(11,31,58,0.08)] hover:border-[#24B8A6]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0b1f3a] to-[#1e3a66] text-white text-xs font-black flex items-center justify-center shadow-xs">
                    02
                  </span>
                  <span className="text-[10px] font-extrabold text-neutral-400 tracking-wider uppercase bg-neutral-100/80 px-2 py-0.5 rounded-full">
                    Step 2
                  </span>
                </div>

                {/* Sleek URL Encoder Card Mockup */}
                <div className="h-36 py-2 flex items-center justify-center relative">
                  {/* Radiant background glow */}
                  <div className="absolute w-24 h-24 rounded-full bg-blue-400/15 blur-xl group-hover:bg-blue-400/30 group-hover:scale-125 transition-all duration-500" />

                  <div className="w-full max-w-[210px] bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-2xl p-3 shadow-sm group-hover:shadow-md transition-all relative z-10 space-y-2">
                    <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-400/70 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-amber-400/70 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400/70 inline-block" />
                      </div>
                      <span className="text-[9px] text-teal-600 font-bold">NFC Link</span>
                    </div>

                    <div className="w-full rounded-lg bg-white border border-neutral-300/80 p-1.5 flex items-center gap-1.5 shadow-2xs">
                      <span className="text-[10px]">🔗</span>
                      <span className="text-[10px] text-[#0b1f3a] font-bold font-mono truncate">
                        instagram.com/@alex
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[9px] text-neutral-400">Status</span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        <Check className="w-2.5 h-2.5 text-teal-600" />
                        NTAG215 Ready
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-bold text-[#0b1f3a] group-hover:text-[#0d9488] transition-colors">
                    Add Your Link
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Provide your Instagram, WhatsApp, Spotify playlist, portfolio, website or custom link.
                  </p>
                </div>
              </div>

              {/* Step 03 */}
              <div className="group relative p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(11,31,58,0.08)] hover:border-[#24B8A6]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0b1f3a] to-[#1e3a66] text-white text-xs font-black flex items-center justify-center shadow-xs">
                    03
                  </span>
                  <span className="text-[10px] font-extrabold text-neutral-400 tracking-wider uppercase bg-neutral-100/80 px-2 py-0.5 rounded-full">
                    Step 3
                  </span>
                </div>

                {/* Instant Tap & Connect Radar Stage */}
                <div className="h-36 py-2 flex items-center justify-center relative">
                  {/* Radiant background glow */}
                  <div className="absolute w-28 h-28 rounded-full bg-teal-400/20 blur-xl group-hover:bg-teal-400/35 group-hover:scale-125 transition-all duration-500" />

                  {/* Pulsing Concentric Radar Rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full border border-teal-300 animate-ping opacity-40" />
                    <div className="w-28 h-28 rounded-full border border-teal-200/60 animate-ping opacity-20 [animation-delay:400ms]" />
                  </div>

                  {/* High-tech NFC Center Emblem */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0b1f3a] to-[#1e3a66] border border-teal-400/30 shadow-lg shadow-[#0b1f3a]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Radio className="w-8 h-8 text-[#24B8A6] animate-pulse" />
                    </div>
                  </div>

                  {/* Micro Pill Badge */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-center z-10">
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50/95 border border-teal-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
                      <Zap className="w-2.5 h-2.5 text-teal-600" />
                      Instant 0.1s Tap
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-bold text-[#0b1f3a] group-hover:text-[#0d9488] transition-colors">
                    Tap and Connect
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Tap the keychain near any NFC-enabled phone to launch your link instantly — zero apps needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: BEST SELLERS - POPULAR KEYCHAINS (Matching Image 1)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Best Sellers Product Grid */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-[11px] font-extrabold tracking-widest uppercase text-neutral-400 block mb-1">
                  BEST SELLERS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0b1f3a]">
                  Popular Keychains
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Most loved designs, ready to make your digital world more accessible and stylish.
                </p>
              </div>

              {/* Product Grid - 2 in a row on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {bestSellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Side Cards (Testimonial, Gift Showcase, Newsletter) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Testimonial Card matching Image 1 with real backpack photo */}
              <div className="group p-5 rounded-3xl bg-neutral-50/90 border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(11,31,58,0.08)] hover:border-[#24B8A6]/40 transition-all duration-300 space-y-3.5">
                <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-neutral-200 shadow-inner">
                  <img
                    src="/images/backpack_keychain.jpg"
                    alt="Smart Choice Diamond Keychain on Backpack"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[9px] text-[#0b1f3a] font-extrabold uppercase tracking-wider shadow-xs border border-neutral-200/60">
                    Real Lifestyle
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] text-white font-bold">
                    Spotify Diamond PLA
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      ✓ Verified Buyer
                    </span>
                  </div>

                  <p className="text-xs text-neutral-700 italic leading-relaxed">
                    “Such a cool product! Now I can share my Instagram &amp; Spotify with just a tap on my backpack. The 3D diamond finish is ultra-clean.”
                  </p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    — Alex M., Bengaluru
                  </p>
                </div>
              </div>

              {/* "A Perfect Gift for Every Occasion" Card matching Image 1 */}
              <div className="group relative p-6 rounded-3xl bg-gradient-to-br from-[#0c203b] via-[#0b1f3a] to-[#122b52] text-white shadow-xl border border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Background ambient orb */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-bold text-teal-300">
                    <Gift className="w-3 h-3 text-teal-300" />
                    <span>Luxury Unboxing Experience</span>
                  </div>

                  <h3 className="text-lg font-black text-white leading-snug">
                    A Perfect Gift for Every Occasion
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    For friends, creators, professionals and loved ones. Includes luxury matte black packaging with custom-cut velvet foam insert.
                  </p>

                  <div className="pt-1">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0b1f3a] hover:bg-neutral-100 rounded-full text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl overflow-hidden border border-white/15 shadow-xl relative group-hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src="/images/gift_box_keychain.jpg"
                    alt="Smart Choice Luxury Gift Box with Diamond Keychain"
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] text-neutral-200 font-medium">
                    Smart Choice Signature Box
                  </div>
                </div>
              </div>

              {/* Newsletter Signup Box matching Image 1 */}
              <div className="p-5 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
                <h4 className="text-sm font-black text-[#0b1f3a]">Join Smart Choice</h4>
                <p className="text-xs text-neutral-500">
                  Get updates on new designs and exclusive deals.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#24B8A6]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#0b1f3a] hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: REAL PHYSICAL KEYCHAINS SHOWCASE (User's Real Photos)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAFBFD] to-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-[#0d9488] block">
              100% AUTHENTIC 3D PRINTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0b1f3a]">
              Signature 45° Diamond Ergonomic Design
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
              Each Smart Choice keychain is precision crafted in our signature 45° rounded diamond form factor,
              using dual-extruded recyclable PLA plastic and high-speed rewritable NTAG215 microchips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Real Spotify Photo */}
            <div className="group relative rounded-3xl bg-white border border-neutral-200/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(11,31,58,0.09)] hover:border-[#24B8A6]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-50 to-white border border-neutral-100 relative flex items-center justify-center">
                {/* Soft ambient glow */}
                <div className="absolute w-36 h-36 rounded-full bg-emerald-400/15 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                
                <img
                  src="/images/photos/spotify_real_keychain.png"
                  alt="Physical Spotify NFC Diamond Keychain"
                  className="w-full h-full object-contain p-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 relative z-10"
                  loading="lazy"
                />

                <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-black text-[#0b1f3a] shadow-xs border border-neutral-200/60 z-20">
                  Spotify Diamond PLA
                </span>

                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-emerald-200/80 shadow-2xs z-20">
                  Dual-Layer 3D Print
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0b1f3a] group-hover:text-[#0d9488] transition-colors">
                    Teal Green PLA Finish
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Raised audio soundwave details</p>
                </div>
                <Link
                  to="/product/spotify-nfc-keychain"
                  className="px-4 py-2 bg-neutral-100 group-hover:bg-[#0b1f3a] text-neutral-800 group-hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span className="text-neutral-400 line-through text-[10px] group-hover:text-neutral-300 font-normal">₹350</span>
                  <span>₹169</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Real Instagram Photo */}
            <div className="group relative rounded-3xl bg-white border border-neutral-200/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(11,31,58,0.09)] hover:border-[#24B8A6]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-neutral-50 to-white border border-neutral-100 relative flex items-center justify-center">
                {/* Soft ambient glow */}
                <div className="absolute w-36 h-36 rounded-full bg-rose-400/15 blur-2xl group-hover:scale-125 transition-transform duration-500" />

                <img
                  src="/images/photos/instagram_real_keychain.jpg"
                  alt="Physical Instagram NFC Diamond Keychain"
                  className="w-full h-full object-contain p-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 relative z-10"
                  loading="lazy"
                />

                <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-black text-[#0b1f3a] shadow-xs border border-neutral-200/60 z-20">
                  Blossom Pink PLA
                </span>

                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-rose-50 text-rose-800 rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-rose-200/80 shadow-2xs z-20">
                  Embossed Lens
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0b1f3a] group-hover:text-[#0d9488] transition-colors">
                    Instagram Squircle Diamond
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Dual-layer embossed camera glyph</p>
                </div>
                <Link
                  to="/product/instagram-nfc-keychain"
                  className="px-4 py-2 bg-neutral-100 group-hover:bg-[#0b1f3a] text-neutral-800 group-hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span className="text-neutral-400 line-through text-[10px] group-hover:text-neutral-300 font-normal">₹350</span>
                  <span>₹169</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Real Batch Collection Flatlay */}
            <div className="group relative rounded-3xl bg-white border border-neutral-200/90 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(11,31,58,0.09)] hover:border-[#24B8A6]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
              <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100 relative">
                <img
                  src="/images/collection_diamond_keychains.jpg"
                  alt="Batch of Physical 3D NFC Keychains"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />

                <span className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[11px] font-black text-[#0b1f3a] shadow-xs border border-neutral-200/60 z-20">
                  Full 2026 Collection
                </span>

                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-blue-50 text-blue-800 rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-blue-200/80 shadow-2xs z-20">
                  Spotify • Insta • WA • YouTube
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#0b1f3a] group-hover:text-[#0d9488] transition-colors">
                    Custom Social Suite
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Universal iPhone &amp; Android sync</p>
                </div>
                <Link
                  to="/shop"
                  className="px-4 py-2 bg-[#0b1f3a] text-white hover:bg-neutral-800 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                >
                  <span>Browse All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: BOTTOM TRUST BADGES BAR (Matching Image 1 Footer)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#0d9488] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0b1f3a]">Free Shipping</h4>
                <p className="text-[11px] text-neutral-500">on orders above ₹499</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0b1f3a]">Secure Payments</h4>
                <p className="text-[11px] text-neutral-500">with Razorpay</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0b1f3a]">Easy Returns</h4>
                <p className="text-[11px] text-neutral-500">Hassle free process</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0b1f3a]">Dedicated Support</h4>
                <p className="text-[11px] text-neutral-500">We are here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          QUOTE REQUEST POPUP — collects name + phone, pushes to WhatsApp
      ───────────────────────────────────────────────────────────── */}
      <QuotePopup open={quotePopupOpen} onClose={() => setQuotePopupOpen(false)} />

      {/* ─────────────────────────────────────────────────────────────
          VIDEO / INTERACTIVE DEMO MODAL ("Watch How It Works")
      ───────────────────────────────────────────────────────────── */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-neutral-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#24B8A6] animate-pulse" />
                <h3 className="text-base font-bold text-[#0b1f3a]">
                  How Smart Choice NFC Keychains Work
                </h3>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Step-by-Step Walkthrough in Modal */}
            <div className="space-y-4 py-2">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[#0c203b] to-[#0b1f3a] p-6 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-full border border-teal-400 animate-ping opacity-50 absolute" />
                <div className="relative z-10 space-y-2">
                  <img
                    src="/images/photos/spotify_real_keychain_clean.png"
                    alt="Physical Spotify NFC Keychain"
                    className="w-24 h-24 object-contain mx-auto filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
                  />
                  <h4 className="text-lg font-bold text-white mt-2">
                    Zero Batteries. Instant Transmission.
                  </h4>
                  <p className="text-xs text-neutral-300 max-w-md">
                    Smart Choice embeds a passive NTAG215 microchip powered by radio frequency from the
                    detecting smartphone. Simply tap within 2-4 cm of the phone's NFC antenna.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="font-bold text-[#0b1f3a]">1. No App Needed</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Native iOS &amp; Android prompt</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="font-bold text-[#0b1f3a]">2. Rewritable</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Update link anytime with phone</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="font-bold text-[#0b1f3a]">3. Waterproof</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Sealed PLA solid enclosure</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-6 py-2.5 bg-[#0b1f3a] text-white rounded-full text-xs font-bold hover:bg-neutral-800"
              >
                Close &amp; Explore Keychains
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;