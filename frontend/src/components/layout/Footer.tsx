import { Link } from 'react-router-dom';
import { Radio, MessageCircle, Heart, Shield, RotateCcw, Truck, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-800">
      {/* Trust Badges */}
      <div className="border-b border-neutral-100 bg-neutral-50/50 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-3">
            <Truck className="w-6 h-6 text-brand-teal mb-2" />
            <h4 className="text-sm font-semibold text-brand-navy">Fast India Shipping</h4>
            <p className="text-xs text-neutral-500 mt-0.5">2-4 business days delivery</p>
          </div>
          <div className="flex flex-col items-center p-3">
            <Shield className="w-6 h-6 text-brand-teal mb-2" />
            <h4 className="text-sm font-semibold text-brand-navy">NTAG215 High Speed</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Instant tap response</p>
          </div>
          <div className="flex flex-col items-center p-3">
            <RotateCcw className="w-6 h-6 text-brand-teal mb-2" />
            <h4 className="text-sm font-semibold text-brand-navy">30-Day Guarantee</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Hassle-free replacement</p>
          </div>
          <div className="flex flex-col items-center p-3">
            <Radio className="w-6 h-6 text-brand-teal mb-2" />
            <h4 className="text-sm font-semibold text-brand-navy">Universal Compatible</h4>
            <p className="text-xs text-neutral-500 mt-0.5">Works on iPhone & Android</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group py-1">
              <img
                src="/images/smart_choice_logo_transparent.png"
                alt="Smart Choice - One Tap. Your Digital World."
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>
            <p className="text-sm text-neutral-600 max-w-sm leading-relaxed">
              Elevate your digital identity. Smart Choice crafts Apple-grade, stylish NFC keychains that connect your physical presence with your digital world in a single effortless tap.
            </p>
            <div className="pt-2 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://wa.me/919342626096"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> +91 93426 26096
                </a>
                <a
                  href="mailto:nirmalkumar00727@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  nirmalkumar00727@gmail.com
                </a>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium">
                Founder: <span className="font-bold text-[#0b1f3a]">Nirmal kumar N</span> &bull; Smart Choice
              </p>
            </div>
          </div>

          {/* Column 1: Keychains */}
          <div className="col-span-1">
            <h3 className="font-semibold text-brand-navy text-sm mb-3 sm:mb-4">NFC Keychains</h3>
            <ul className="space-y-2 sm:space-y-2.5 text-xs text-neutral-600">
              <li><Link to="/product/instagram-nfc-keychain" className="hover:text-brand-teal transition-colors">Instagram Keychain</Link></li>
              <li><Link to="/product/whatsapp-nfc-keychain" className="hover:text-brand-teal transition-colors">WhatsApp Keychain</Link></li>
              <li><Link to="/product/portfolio-nfc-keychain" className="hover:text-brand-teal transition-colors">Portfolio Keychain</Link></li>
              <li><Link to="/product/website-nfc-keychain" className="hover:text-brand-teal transition-colors">Website Keychain</Link></li>
              <li><Link to="/product/spotify-nfc-keychain" className="hover:text-brand-teal transition-colors">Spotify Keychain</Link></li>
              <li><Link to="/product/youtube-nfc-keychain" className="hover:text-brand-teal transition-colors">YouTube Keychain</Link></li>
              <li><Link to="/product/facebook-nfc-keychain" className="hover:text-brand-teal transition-colors">Facebook Keychain</Link></li>
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div className="col-span-1">
            <h3 className="font-semibold text-brand-navy text-sm mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2 sm:space-y-2.5 text-xs text-neutral-600">
              <li><Link to="/shop" className="hover:text-brand-teal transition-colors">All Keychains</Link></li>
              <li><Link to="/how-it-works" className="hover:text-brand-teal transition-colors">How NFC Works</Link></li>
              <li><Link to="/about" className="hover:text-brand-teal transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-teal transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Legal */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <h3 className="font-semibold text-brand-navy text-sm mb-3 sm:mb-4">Support & Legal</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:space-y-2.5 sm:gap-0 text-xs text-neutral-600">
              <li><Link to="/faq" className="hover:text-brand-teal transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/returns" className="hover:text-brand-teal transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Smart Choice E-Commerce. Made with precision in India.</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <div className="flex items-center gap-1">
              <span>Engineered with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>for seamless networking</span>
            </div>
            <span>&bull;</span>
            <Link
              to="/admin/login"
              className="text-neutral-400 hover:text-brand-navy flex items-center gap-1 text-[11px] font-semibold transition-colors"
              title="Restricted Admin Login"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
              <span>Admin Portal Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;