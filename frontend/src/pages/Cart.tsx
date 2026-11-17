import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useStore';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Radio,
  Truck
} from 'lucide-react';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent?: number; fixed?: number } | null>(null);

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.salePrice || item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  // Free shipping on orders >= 499
  const freeShippingThreshold = 499;
  const shippingCharge = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 49;

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.percent) {
      discountAmount = Math.round((subtotal * appliedDiscount.percent) / 100);
    } else if (appliedDiscount.fixed) {
      discountAmount = appliedDiscount.fixed;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharge);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'SMART10') {
      setAppliedDiscount({ code: 'SMART10', percent: 10 });
      toast.success('Applied 10% discount coupon!');
    } else if (clean === 'FIRSTBUY') {
      setAppliedDiscount({ code: 'FIRSTBUY', fixed: 200 });
      toast.success('Applied ₹200 discount coupon!');
    } else {
      toast.error('Invalid coupon code. Try SMART10 or FIRSTBUY');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-white text-center">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-navy">Your Bag is Empty</h2>
          <p className="text-sm text-neutral-500">
            Looks like you haven't added any Smart Choice NFC keychains to your bag yet.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-navy hover:bg-neutral-800 text-white font-semibold rounded-2xl text-sm shadow-sm transition-all"
            >
              <span>Explore 7 Keychains</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalMrp = items.reduce((sum, item) => sum + (item.price || 350) * item.quantity, 0);
  const totalDiscountOnMrp = totalMrp - subtotal;
  const totalSavings = totalDiscountOnMrp + discountAmount;

  return (
    <div className="min-h-screen bg-white text-brand-navy py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between pb-8 border-b border-neutral-100">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Review your customized NFC keychains before checkout
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Clear all items from your bag?')) {
                clearCart();
                toast.success('Shopping bag cleared');
              }
            }}
            className="text-xs text-neutral-400 hover:text-rose-600 transition-colors"
          >
            Clear Bag
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="my-6 p-4 rounded-2xl bg-teal-50/60 border border-teal-100/80 flex items-center gap-3">
          <Truck className="w-5 h-5 text-brand-teal flex-shrink-0" />
          <div className="flex-1">
            {subtotal >= freeShippingThreshold ? (
              <p className="text-xs font-bold text-teal-900">
                🎉 Congratulations! You have unlocked FREE Express Delivery across India.
              </p>
            ) : (
              <p className="text-xs font-semibold text-teal-800">
                Add <strong>{formatCurrency(freeShippingThreshold - subtotal)}</strong> more to unlock FREE Express Delivery!
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const itemPrice = item.salePrice || item.price;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-neutral-200/80 bg-white flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover bg-neutral-100 border border-neutral-200 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-brand-teal px-1.5 py-0.5 rounded bg-teal-50">
                          {item.customDestinationType}
                        </span>
                        <span className="text-xs text-neutral-400">&bull; {item.color}</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-sky-800 bg-sky-50 border border-sky-200/80 px-1.5 py-0.2 rounded italic">
                          Assured <span className="text-emerald-600 font-black not-italic">✓</span>
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-brand-navy">{item.name}</h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 bg-neutral-50 px-2 py-1 rounded-md">
                        <Radio className="w-3 h-3 text-brand-teal flex-shrink-0" />
                        <span className="truncate max-w-[220px] sm:max-w-xs font-mono">
                          {item.customDestinationUrl}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 px-2.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="text-neutral-500 hover:text-brand-navy font-bold px-1 text-xs"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-bold text-brand-navy">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-neutral-500 hover:text-brand-navy font-bold px-1 text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Price with Flipkart style M.R.P. strikethrough */}
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="font-extrabold text-brand-navy text-base">
                          {formatCurrency(itemPrice * item.quantity)}
                        </span>
                        {(item.price || 350) > itemPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatCurrency((item.price || 350) * item.quantity)}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold">
                        Save {formatCurrency(((item.price || 350) - itemPrice) * item.quantity)}
                      </p>
                    </div>

                    {/* Delete item */}
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success('Removed item');
                      }}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="pt-4">
              <Link
                to="/shop"
                className="text-xs font-semibold text-brand-teal hover:underline inline-flex items-center gap-1"
              >
                &larr; Add more keychains to bag
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar (Flipkart Style Price Details) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-sm space-y-5">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-100 pb-3">
                PRICE DETAILS
              </h3>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">
                  Have a Coupon Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SMART10 or FIRSTBUY"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs uppercase font-bold focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedDiscount && (
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon {appliedDiscount.code} applied!
                  </p>
                )}
              </form>

              {/* Flipkart Style Price Details Breakdown */}
              <div className="space-y-3 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Price ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-neutral-900">{formatCurrency(totalMrp)}</span>
                </div>

                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount on M.R.P.</span>
                  <span>- {formatCurrency(totalDiscountOnMrp)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span>
                    {shippingCharge === 0 ? (
                      <span className="flex items-center gap-1.5">
                        <span className="line-through text-neutral-400">₹49</span>
                        <span className="text-emerald-600 uppercase font-black text-[11px]">FREE</span>
                      </span>
                    ) : (
                      <span className="font-semibold text-neutral-900">{formatCurrency(shippingCharge)}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>NFC Custom Chip Encoding</span>
                  <span className="text-emerald-600 uppercase font-black text-[11px]">FREE</span>
                </div>

                <div className="pt-3 border-t-2 border-dashed border-neutral-200 flex justify-between text-base font-black text-brand-navy">
                  <span>Total Amount</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Flipkart Celebratory Green Strip */}
              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-center">
                <p className="text-xs font-extrabold text-emerald-800">
                  🎉 You will save {formatCurrency(totalSavings)} on this order
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-brand-teal hover:bg-teal-500 text-brand-navy font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Flipkart Trust Footnote */}
              <div className="space-y-1.5 pt-2 text-center">
                <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Safe and Secure Payments &bull; 100% Authentic Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
