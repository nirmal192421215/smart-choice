import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../hooks/useStore';
import { formatCurrency } from '../utils/helpers';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Radio,
  MapPin,
  Clock,
  MessageCircle,
  QrCode,
  ShieldCheck
} from 'lucide-react';

export const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useOrders();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  const whatsappMessage = order
    ? `Hi Nirmal kumar, I have placed Order #${order.orderNumber} for ${formatCurrency(order.totalAmount)} on Smart Choice.\n\nPayment Method: ${order.paymentMethod === 'upi_qr' ? 'UPI QR Payment' : 'Cash on Delivery'}${order.upiTransactionId ? `\nUPI UTR Ref: ${order.upiTransactionId}` : ''}\nRecipient: ${order.shippingAddress.name} (${order.shippingAddress.mobile})\nAddress: ${order.shippingAddress.city}, ${order.shippingAddress.state}\n\nPlease confirm my order!`
    : 'Hi Nirmal kumar, I placed an order on Smart Choice!';

  const whatsappUrl = `https://wa.me/919342626096?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 px-6 text-brand-navy">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Celebration Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Order Confirmed &bull; #{order?.orderNumber || orderId}
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Thank you for your order!
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto">
            Your customized Smart Choice NFC keychain is now queued for precision encoding and hardware testing.
          </p>
        </div>

        {/* Status Tracker */}
        <div className="bg-neutral-50 rounded-3xl p-6 sm:p-8 border border-neutral-200/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200/80 text-xs gap-3">
            <div>
              <span className="text-neutral-400 block text-[11px] uppercase">Estimated Dispatch</span>
              <strong className="text-brand-navy font-bold">Within 24 Hours</strong>
            </div>
            <div className="sm:text-right">
              <span className="text-neutral-400 block text-[11px] uppercase">Payment Method</span>
              <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                {order?.paymentMethod === 'upi_qr' ? (
                  <>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-extrabold text-[11px]">
                      UPI QR PAYMENT
                    </span>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      (UTR: {order.upiTransactionId || 'Submitted'})
                    </span>
                  </>
                ) : (
                  <strong className="text-brand-navy font-bold uppercase">
                    Cash on Delivery (COD)
                  </strong>
                )}
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold text-xs">
                ✓
              </div>
              <span className="font-bold text-brand-navy block text-[11px]">Confirmed</span>
            </div>
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-brand-navy text-white flex items-center justify-center mx-auto font-bold text-xs">
                2
              </div>
              <span className="font-semibold text-neutral-600 block text-[11px]">Encoding Chip</span>
            </div>
            <div className="space-y-1.5 opacity-40">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center mx-auto font-bold text-xs">
                3
              </div>
              <span className="font-medium text-neutral-600 block text-[11px]">Shipped</span>
            </div>
            <div className="space-y-1.5 opacity-40">
              <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center mx-auto font-bold text-xs">
                4
              </div>
              <span className="font-medium text-neutral-600 block text-[11px]">Delivered</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Fast Confirmation Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-extrabold text-brand-navy flex items-center justify-center sm:justify-start gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Send Payment Screenshot or UTR to Founder</span>
            </h4>
            <p className="text-xs text-neutral-600">
              Send your order details to <strong>+91 93426 26096</strong> for priority chip encoding and immediate dispatch tracking.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Order Details Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-6">
            <h3 className="font-extrabold text-base border-b border-neutral-100 pb-3">
              Order Summary
            </h3>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200"
                  />
                  <div className="flex-1 truncate">
                    <p className="font-bold text-brand-navy">{item.name}</p>
                    <p className="text-[11px] text-neutral-500">{item.color} &bull; Qty: {item.quantity}</p>
                    <p className="text-[10px] text-brand-teal font-mono truncate">{item.customDestinationUrl}</p>
                  </div>
                  <span className="font-bold text-brand-navy">
                    {formatCurrency((item.salePrice || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-600 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-navy">{order.shippingAddress.name}</strong> ({order.shippingAddress.mobile})
                <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2 || ''}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-sm font-bold text-brand-navy">
              <span>Total Paid / Payable</span>
              <span className="text-brand-teal text-base">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-7 py-3.5 bg-brand-navy hover:bg-neutral-800 text-white font-semibold rounded-2xl text-xs shadow-sm transition-all text-center"
          >
            View Order History
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-7 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-brand-navy font-semibold rounded-2xl text-xs transition-all text-center"
          >
            Continue Shopping &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
export default OrderSuccess;
