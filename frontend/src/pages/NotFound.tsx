import { Link } from 'react-router-dom';
import { Radio, ArrowLeft, Home as HomeIcon } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-white text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-brand-navy">
          <Radio className="w-8 h-8 text-brand-teal" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-teal">404 Error</span>
        <h1 className="text-4xl font-extrabold text-brand-navy">Page Not Found</h1>
        <p className="text-sm text-neutral-500 leading-relaxed">
          The page or NFC keychain you are looking for might have been moved, renamed, or is temporarily unavailable.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-brand-navy hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <HomeIcon className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-brand-navy rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Browse Keychains
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
