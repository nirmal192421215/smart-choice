import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart, useUser } from '../../hooks/useStore';
import { cn } from '../../utils/theme';
import {
  Search,
  ShoppingBag,
  Menu,
  User as UserIcon,
  LogOut,
  X,
  Truck,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdminStore';
import { Keychain3D } from '../common/Keychain3D';

const NavLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const { user, isAuthenticated, logout } = useUser();
  const { products } = useAdminProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products for quick search dropdown
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchFocused(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
      {/* Top Level Announcement Bar matching UI mockup */}
      <div className="bg-[#0b1f3a] text-white text-[11px] sm:text-xs py-2 px-4 font-medium border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-neutral-300">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Truck className="w-3.5 h-3.5 text-brand-teal" />
            <span className="text-white font-medium">Free Shipping on Orders Above ₹499</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
            <span>Premium 3D Printed Design</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
            <span>Secure &amp; Customised NFC Tags</span>
          </div>

          <div className="flex items-center gap-2 text-brand-teal font-semibold">
            <span>One Tap. Your Digital World.</span>
            <span className="text-amber-400 font-bold">✦</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center group py-0.5">
            <img
              src="/images/smart_choice_logo_transparent.png"
              alt="Smart Choice - One Tap. Your Digital World."
              className="h-8 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 ml-4">
            {NavLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={cn(
                    'text-[13px] font-semibold transition-colors duration-200 py-1 relative',
                    isActive
                      ? 'text-[#0b1f3a] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0b1f3a]'
                      : 'text-neutral-600 hover:text-[#0b1f3a]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Search Bar, Profile, Cart Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Real Interactive Search Bar matching UI mockup */}
          <div ref={searchRef} className="relative hidden sm:block w-48 md:w-64">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search keychains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs font-medium text-neutral-800 rounded-full border border-transparent focus:border-neutral-300 focus:outline-none transition-all placeholder:text-neutral-400"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Live Search Quick Results Dropdown */}
            {searchFocused && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-neutral-100 py-2 z-50 overflow-hidden animate-fade-in">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-400 border-b border-neutral-50">
                  Matching Keychains
                </div>
                {filteredProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    onClick={() => setSearchFocused(false)}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center p-1 border border-neutral-100">
                      <Keychain3D category={p.category} size="sm" withChain={false} interactive={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-brand-teal font-semibold">₹{p.salePrice || p.price}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User Account Button */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 flex items-center justify-center text-neutral-700 transition-colors"
                title="Account"
              >
                <UserIcon className="w-4 h-4 text-[#0b1f3a]" />
              </button>
            ) : (
              <Link
                to="/login"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 flex items-center justify-center text-neutral-700 transition-colors"
                title="Sign In"
              >
                <UserIcon className="w-4 h-4 text-[#0b1f3a]" />
              </Link>
            )}

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 border border-neutral-100 z-50">
                <div className="px-4 py-2 border-b border-neutral-100">
                  <p className="text-xs font-bold text-brand-navy">{user?.name}</p>
                  <p className="text-[11px] text-neutral-400 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/account"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-50"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-neutral-50 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            )}
          </div>

          {/* Shopping Cart Pill Button with badge (2) matching reference mockup */}
          <Link
            to="/cart"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 transition-all group"
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#0b1f3a] group-hover:scale-110 transition-transform" />
            <span className="w-5 h-5 rounded-full bg-[#0b1f3a] text-white text-[11px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 hover:text-brand-navy rounded-full"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-4 space-y-3 animate-fade-down">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search keychains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-100 text-xs font-medium text-neutral-800 rounded-full border border-neutral-200"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {NavLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-neutral-800 hover:text-brand-teal"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;