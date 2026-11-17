import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart, useOrders, useUser } from '../hooks/useStore';
import { useAdminPaymentSettings } from '../hooks/useAdminStore';
import { formatCurrency, isValidEmail, isValidMobile, isValidPinCode } from '../utils/helpers';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  ArrowRight,
  Radio,
  Lock,
  ChevronLeft,
  QrCode,
  Copy,
  Check,
  Smartphone,
  Info,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { ShippingAddress, Order } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useUser();
  const { settings: paymentSettings } = useAdminPaymentSettings();

  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'cod'>('upi_qr');
  const [upiUtr, setUpiUtr] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<ShippingAddress>({
    name: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
  });

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.salePrice || item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalMrp = items.reduce((sum, item) => sum + (item.price || 350) * item.quantity, 0);
  const shippingCharges = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const totalAmount = subtotal + shippingCharges;
  const totalSavings = Math.max(0, totalMrp - subtotal);

  // Payee & QR settings (Nirmal's real PhonePe QR)
  const upiId = paymentSettings.upiId || '9342626096@ybl';
  const payeeName = paymentSettings.payeeName || 'NIRMAL KUMAR N';
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Smart Choice NFC Keychains')}`;
  const phonepeDeepLink = `phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR`;
  const gpayDeepLink = `gpay://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR`;
  const paytmDeepLink = `paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR`;

  // Always use Nirmal's authentic PhonePe QR code
  const qrCodeApiUrl = paymentSettings.qrImageUrl && paymentSettings.qrImageUrl.trim() !== ''
    ? paymentSettings.qrImageUrl
    : '/images/nirmal_phonepe_qr.png';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setIsCopied(true);
    toast.success(`Copied UPI ID: ${upiId}`);
    setTimeout(() => setIsCopied(false), 2500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-white text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold text-brand-navy">Your bag is empty</h2>
          <p className="text-xs text-neutral-500">Please add keychains before checking out.</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-brand-navy text-white text-xs font-semibold rounded-xl"
          >
            Browse Keychains
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Please enter your full name');
    if (!isValidMobile(form.mobile)) return toast.error('Please enter a valid 10-digit Indian mobile number');
    if (!form.addressLine1.trim()) return toast.error('Please enter your delivery address');
    if (!form.city.trim()) return toast.error('Please enter your city');
    if (!isValidPinCode(form.pinCode)) return toast.error('Please enter a valid 6-digit PIN code');

    // Default fallback email if not provided so order record remains consistent
    const safeEmail = form.email && form.email.trim() !== '' ? form.email : `${form.mobile}@smartchoice.in`;

    if (paymentMethod === 'upi_qr') {
      if (!upiUtr.trim()) {
        return toast.error('Please enter the 12-digit UPI UTR / Transaction ID after making the payment');
      }
      if (upiUtr.trim().length < 6) {
        return toast.error('Please enter a valid UPI UTR / Transaction reference number');
      }
    }

    setIsSubmitting(true);

    try {
      const orderId = `SC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      const newOrder: Order = {
        id: orderId,
        orderNumber: orderId,
        userId: user?.id,
        items: [...items],
        shippingAddress: {
          ...form,
          email: safeEmail,
        },
        subtotal,
        shippingCharges,
        discount: 0,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'authorized' : 'pending',
        status: 'Confirmed',
        upiTransactionId: paymentMethod === 'upi_qr' ? upiUtr.trim() : undefined,
        upiPayee: paymentMethod === 'upi_qr' ? upiId : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save order to store
      addOrder(newOrder);

      // Trigger Confetti effect
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Clear the cart
      clearCart();

      toast.success(
        paymentMethod === 'upi_qr'
          ? 'Payment submitted! Order queued for verification.'
          : 'Order placed successfully!'
      );
      navigate(`/order-success/${orderId}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-brand-navy py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between border-b border-neutral-100 pb-4">
          <Link to="/cart" className="text-xs font-semibold text-neutral-500 hover:text-brand-navy flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Bag
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
          </span>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Form: Delivery Address & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Delivery Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-lg font-bold text-brand-navy">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. Full Name */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>

                {/* 2. Mobile Number */}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>

                {/* 3. Delivery Address (Complete House/Street/Area) */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">Full Delivery Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Building Name, Street & Area"
                    value={form.addressLine1}
                    onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>

                {/* 4. City, State & PIN Code in a compact row */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai / Chennai"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">State *</label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">PIN Code (6 Digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 600001"
                      value={form.pinCode}
                      onChange={(e) => setForm({ ...form, pinCode: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-lg font-bold text-brand-navy">Select Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Instant UPI QR Code Payment */}
                <div
                  onClick={() => setPaymentMethod('upi_qr')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                    paymentMethod === 'upi_qr'
                      ? 'border-brand-teal bg-teal-50/40 shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-navy text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4 text-brand-teal" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy">Instant UPI / QR Code</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      GPay, PhonePe, Paytm, CRED or any UPI App
                    </p>
                    <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Direct 0% Fee ⚡
                    </span>
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-brand-teal bg-teal-50/40 shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-200 text-neutral-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Pay cash upon doorstep delivery across India
                    </p>
                  </div>
                </div>
              </div>

              {/* ── UPI QR Payment Card (Active when UPI QR is selected) ── */}
              {paymentMethod === 'upi_qr' && (
                <div className="mt-4 p-5 sm:p-6 bg-gradient-to-br from-neutral-900 via-[#101426] to-[#0b1f3a] text-white rounded-3xl border-2 border-[#5f259f]/50 shadow-xl space-y-5 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Nirmal's PhonePe Stand QR */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative p-2 bg-black rounded-2xl shadow-2xl border-2 border-[#5f259f]/60 group overflow-hidden max-w-[210px]">
                        <img
                          src={qrCodeApiUrl}
                          alt="Nirmal Kumar N PhonePe QR Code"
                          className="w-full h-auto object-contain rounded-xl"
                          loading="eager"
                        />
                        <div className="mt-1 py-1 bg-[#5f259f] text-white text-[10px] font-black tracking-wider text-center rounded-lg uppercase">
                          Pay ₹{totalAmount}
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-brand-teal" /> All UPI Apps Supported
                      </span>
                    </div>

                    {/* Payment Details & Quick App Triggers */}
                    <div className="flex-1 space-y-3.5 text-center sm:text-left">
                      <div>
                        <div className="inline-flex items-center gap-1 text-[10px] uppercase font-black text-emerald-400 tracking-wider bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          <Check className="w-3 h-3 text-emerald-400" /> VERIFIED MERCHANT
                        </div>
                        <h3 className="text-lg font-black text-white mt-1">
                          {payeeName}
                        </h3>
                        <p className="text-xs text-neutral-300">
                          Order Payable Amount:{' '}
                          <span className="text-lg font-black text-brand-teal">
                            {formatCurrency(totalAmount)}
                          </span>
                        </p>
                      </div>

                      {/* UPI ID + Copy Button */}
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
                        <div className="text-center sm:text-left">
                          <span className="text-[10px] text-neutral-400 block font-semibold uppercase">Payee UPI ID</span>
                          <span className="text-xs font-mono font-bold text-white select-all">
                            {upiId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-3 py-1.5 bg-brand-teal text-brand-navy hover:bg-teal-400 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-900" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied!' : 'Copy UPI ID'}</span>
                        </button>
                      </div>

                      {/* 1-Tap Mobile UPI App Launchers */}
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          Mobile 1-Tap UPI Launch:
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <a
                            href={phonepeDeepLink}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5f259f] hover:bg-[#6f2fb8] text-white text-[11px] font-extrabold rounded-xl shadow-sm transition-transform active:scale-95"
                          >
                            <span>PhonePe</span>
                          </a>
                          <a
                            href={gpayDeepLink}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-neutral-900 hover:bg-neutral-100 text-[11px] font-extrabold rounded-xl shadow-sm transition-transform active:scale-95"
                          >
                            <span>Google Pay</span>
                          </a>
                          <a
                            href={paytmDeepLink}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002e6e] hover:bg-[#003b8e] text-white text-[11px] font-extrabold rounded-xl shadow-sm transition-transform active:scale-95"
                          >
                            <span>Paytm</span>
                          </a>
                          <a
                            href={upiUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-brand-teal text-[11px] font-extrabold rounded-xl shadow-sm transition-transform active:scale-95"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>Other UPI Apps</span>
                          </a>
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-300 leading-relaxed font-normal">
                        {paymentSettings.instructions}
                      </p>
                    </div>
                  </div>

                  {/* UTR Input Section */}
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-white">
                        Enter 12-Digit UPI Transaction ID / UTR Number *
                      </label>
                      {upiUtr.length >= 12 && (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> 12 Digits Entered
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiUtr}
                        onChange={(e) => setUpiUtr(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                        placeholder="e.g. 428192837192 (from PhonePe / GPay / Paytm)"
                        maxLength={22}
                        className="w-full px-4 py-3 bg-white text-brand-navy border-2 border-brand-teal rounded-2xl font-mono text-sm tracking-wider font-extrabold placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-brand-teal/30 transition-all shadow-md"
                      />
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                      <Info className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                      <span>
                        Where to find UTR? After paying on PhonePe/GPay, open your transaction receipt and copy the 12-digit <strong>UTR / UPI Ref ID</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary (Flipkart / Amazon Style Price Details) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-md space-y-5 sticky top-28">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-3">
                PRICE DETAILS ({totalQuantity} ITEMS)
              </h3>

              {/* Items in order */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-neutral-50 border border-neutral-200 shrink-0" />
                    <div className="flex-1 truncate">
                      <p className="font-bold text-brand-navy truncate">{item.name}</p>
                      <p className="text-[11px] text-neutral-500">{item.color} &bull; Qty: {item.quantity}</p>
                      <p className="text-[10px] text-brand-teal font-mono truncate">{item.customDestinationUrl}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-brand-navy block">
                        {formatCurrency((item.salePrice || item.price) * item.quantity)}
                      </span>
                      {(item.price || 350) > (item.salePrice || item.price) && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {formatCurrency((item.price || 350) * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Flipkart Style Cost Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Total M.R.P.</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(totalMrp)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount on M.R.P.</span>
                  <span>- {formatCurrency(totalSavings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span>
                    {shippingCharges === 0 ? (
                      <span className="flex items-center gap-1">
                        <span className="line-through text-neutral-400">₹49</span>
                        <span className="text-emerald-600 font-black">FREE</span>
                      </span>
                    ) : (
                      <span className="font-semibold text-neutral-900">{formatCurrency(shippingCharges)}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>NTAG215 Custom Programming</span>
                  <span className="text-emerald-600 font-black">FREE</span>
                </div>
                <div className="pt-3 border-t-2 border-dashed border-neutral-200 flex justify-between text-base font-black text-brand-navy">
                  <span>Total Amount</span>
                  <span className="text-brand-teal">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Flipkart Savings Banner */}
              <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-center">
                <p className="text-xs font-extrabold text-emerald-800">
                  🎉 You will save {formatCurrency(totalSavings)} on this order
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-navy hover:bg-neutral-800 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : paymentMethod === 'upi_qr' ? (
                  <>
                    <span>I HAVE PAID • CONFIRM ORDER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>CONFIRM CASH ON DELIVERY ORDER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-center space-y-1">
                <p className="text-[11px] font-bold text-brand-navy flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Purchase Protection Guarantee</span>
                </p>
                <p className="text-[10px] text-neutral-500">
                  7-Day Replacement &bull; Pre-encoded &amp; Signal Tested &bull; Direct Merchant Settlement
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Checkout;
