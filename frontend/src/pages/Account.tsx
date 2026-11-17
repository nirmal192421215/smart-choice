import { useNavigate, Link } from 'react-router-dom';
import { useUser, useOrders } from '../hooks/useStore';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  User as UserIcon,
  LogOut,
  Package,
  Radio,
  MapPin,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const Account = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();
  const { orders } = useOrders();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-white text-center">
        <div className="max-w-md space-y-4">
          <UserIcon className="w-12 h-12 text-neutral-300 mx-auto" />
          <h2 className="text-2xl font-extrabold text-brand-navy">Sign In Required</h2>
          <p className="text-xs text-neutral-500">Please sign in to view your profile and order history.</p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block px-7 py-3 bg-brand-navy text-white text-xs font-semibold rounded-xl"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-brand-navy py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-6 space-y-10">
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-brand-navy to-neutral-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-teal/20 text-brand-teal flex items-center justify-center font-bold text-2xl border border-brand-teal/40">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold">{user.name}</h1>
                <span className="text-[10px] font-bold bg-brand-teal/20 text-brand-teal px-2 py-0.5 rounded-full border border-brand-teal/30">
                  Customer
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                toast.success('Signed out');
                navigate('/');
              }}
              className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Account Details & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 space-y-2">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Total Keychains</span>
            <p className="text-3xl font-extrabold text-brand-navy">
              {orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)}
            </p>
            <p className="text-xs text-neutral-500">Ordered across all time</p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 space-y-2">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Total Orders</span>
            <p className="text-3xl font-extrabold text-brand-navy">{orders.length}</p>
            <p className="text-xs text-neutral-500">Tracked in your account</p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80 space-y-2">
            <span className="text-[11px] font-bold uppercase text-neutral-400">Security</span>
            <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 256-bit Encrypted
            </p>
            <p className="text-xs text-neutral-500">Secure session active</p>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h2 className="text-lg font-bold text-brand-navy">Recent Orders</h2>
            <Link to="/orders" className="text-xs font-bold text-brand-teal hover:underline">
              View All &rarr;
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((o) => (
                <div
                  key={o.id}
                  className="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold font-mono text-brand-navy">{o.orderNumber}</span>
                    <p className="text-[11px] text-neutral-500">{o.items.length} items &bull; {o.status}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="font-extrabold text-brand-navy">{formatCurrency(o.totalAmount)}</span>
                    <Link
                      to={`/order-success/${o.id}`}
                      className="text-xs font-bold text-brand-teal hover:underline"
                    >
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              No orders yet.{' '}
              <Link to="/shop" className="text-brand-teal font-semibold hover:underline">
                Explore Keychain Catalog
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Account;
