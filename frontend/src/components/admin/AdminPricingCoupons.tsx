import React, { useState } from 'react';
import { useAdminCoupons, useAdminProducts } from '../../hooks/useAdminStore';
import { Tag, Plus, Trash2, Check, Percent, Sparkles, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import type { Coupon } from '../../types';
import toast from 'react-hot-toast';

export const AdminPricingCoupons: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, toggleCoupon } = useAdminCoupons();
  const { bulkUpdatePrices, products } = useAdminProducts();

  // Bulk Price Form State
  const [bulkMrp, setBulkMrp] = useState<number>(350);
  const [bulkSalePrice, setBulkSalePrice] = useState<number>(169);

  // New Coupon State
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Omit<Coupon, 'id' | 'createdAt'>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: 100,
    isActive: true,
  });

  const handleBulkUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkSalePrice >= bulkMrp) {
      toast.error('Sale price must be lower than MRP');
      return;
    }
    if (confirm(`Apply MRP ₹${bulkMrp} and Sale Price ₹${bulkSalePrice} across all ${products.length} products?`)) {
      bulkUpdatePrices(bulkMrp, bulkSalePrice);
      toast.success(`Updated prices for all ${products.length} keychains!`);
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      toast.error('Coupon code is required');
      return;
    }

    const created: Coupon = {
      id: `coup_${Date.now().toString(36)}`,
      code: newCoupon.code.toUpperCase().trim(),
      discountType: newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minOrderValue: Number(newCoupon.minOrderValue) || 0,
      maxDiscount: newCoupon.maxDiscount ? Number(newCoupon.maxDiscount) : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    addCoupon(created);
    setIsAddingCoupon(false);
    setNewCoupon({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 0,
      maxDiscount: 100,
      isActive: true,
    });
    toast.success(`Coupon ${created.code} activated!`);
  };

  return (
    <div className="space-y-8">
      {/* 1. Global Price Override / Bulk Updater */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-brand-teal" />
          <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
            Storewide Pricing Engine
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-brand-navy">Bulk Product Pricing Manager</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-xl">
          Instantly synchronize MRP and Selling Price across all live keychain listings on the website with 1 click.
        </p>

        <form onSubmit={handleBulkUpdate} className="mt-5 p-5 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600">Standard MRP (₹)</label>
            <input
              type="number"
              required
              value={bulkMrp}
              onChange={(e) => setBulkMrp(Number(e.target.value))}
              className="w-32 px-3 py-2 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-teal">Discounted Price (₹)</label>
            <input
              type="number"
              required
              value={bulkSalePrice}
              onChange={(e) => setBulkSalePrice(Number(e.target.value))}
              className="w-32 px-3 py-2 rounded-xl border border-brand-teal/50 text-sm font-extrabold text-brand-teal bg-teal-50/20"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold shadow-md transition-all hover:scale-105 flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Apply to All {products.length} Products
          </button>
        </form>
      </div>

      {/* 2. Coupons & Promotional Codes */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-teal" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                Discounts & Offers
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-brand-navy mt-1">
              Active Promo Coupons ({coupons.length})
            </h3>
          </div>

          <button
            onClick={() => setIsAddingCoupon(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        {/* Add Coupon Modal/Drawer */}
        {isAddingCoupon && (
          <form
            onSubmit={handleAddCoupon}
            className="bg-teal-50/30 border border-brand-teal/30 p-5 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
                Create New Promotional Code
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingCoupon(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-600">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DIWALI50"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-600">Discount Type</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discountType: e.target.value as 'percentage' | 'fixed' })
                  }
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold bg-white"
                >
                  <option value="percentage">Percentage (%) Off</option>
                  <option value="fixed">Flat Amount (₹) Off</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-600">Discount Value *</label>
                <input
                  type="number"
                  required
                  value={newCoupon.discountValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-600">Min Cart Value (₹)</label>
                <input
                  type="number"
                  value={newCoupon.minOrderValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCoupon(false)}
                className="px-4 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-teal text-white text-xs font-bold rounded-lg hover:bg-brand-teal/90"
              >
                Save Coupon
              </button>
            </div>
          </form>
        )}

        {/* Coupons List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border transition-all ${
                c.isActive
                  ? 'bg-neutral-50/70 border-neutral-200'
                  : 'bg-neutral-100/50 border-neutral-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-brand-navy text-sm tracking-wider">
                  {c.code}
                </span>
                <button
                  onClick={() => toggleCoupon(c.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    c.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-neutral-200 text-neutral-600 border-neutral-300'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="mt-2 text-xs font-bold text-brand-teal flex items-center gap-1">
                {c.discountType === 'percentage' ? (
                  <span>{c.discountValue}% Off</span>
                ) : (
                  <span>Flat {formatCurrency(c.discountValue)} Off</span>
                )}
                {c.minOrderValue > 0 && (
                  <span className="text-neutral-400 font-normal">
                    (Min: {formatCurrency(c.minOrderValue)})
                  </span>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Created {new Date(c.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => {
                    if (confirm(`Delete coupon "${c.code}"?`)) {
                      deleteCoupon(c.id);
                      toast.success(`Removed ${c.code}`);
                    }
                  }}
                  className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPricingCoupons;
