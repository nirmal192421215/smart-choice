import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useStore';
import { formatCurrency } from '../utils/helpers';
import { Package, Radio, ArrowRight, Clock, MapPin } from 'lucide-react';

export const Orders = () => {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-white text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-navy">No Orders Yet</h2>
          <p className="text-xs text-neutral-500">
            You haven't placed any NFC keychain orders on this device yet.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-navy text-white text-xs font-semibold rounded-xl"
            >
              <span>Explore Keychain Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-brand-navy py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Your Order History</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Track real-time encoding and fulfillment status for your Smart Choice keychains
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-sm space-y-5"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Order Number</span>
                  <strong className="text-brand-navy font-bold font-mono text-sm">{order.orderNumber}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Date Placed</span>
                  <span className="font-medium text-neutral-700">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Status</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[11px]">Total</span>
                  <strong className="text-brand-teal font-extrabold text-sm">{formatCurrency(order.totalAmount)}</strong>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-neutral-100 border border-neutral-200"
                    />
                    <div className="flex-1 truncate">
                      <p className="font-bold text-brand-navy">{item.name}</p>
                      <p className="text-[11px] text-neutral-500">Color: {item.color} &bull; Qty: {item.quantity}</p>
                      <p className="text-[10px] text-brand-teal font-mono truncate">{item.customDestinationUrl}</p>
                    </div>
                    <span className="font-bold text-brand-navy">
                      {formatCurrency((item.salePrice || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Shipping info footer */}
              <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-neutral-500 gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                  <span className="truncate">
                    Shipping to {order.shippingAddress.name}, {order.shippingAddress.city} ({order.shippingAddress.pinCode})
                  </span>
                </div>
                <Link
                  to={`/order-success/${order.id}`}
                  className="text-xs font-semibold text-brand-teal hover:underline"
                >
                  View Details & Live Tracker &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Orders;
