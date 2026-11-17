import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { ProductExtended } from '../../data/products';
import { AdminImageUpload } from './AdminImageUpload';
import type { ProductCategory } from '../../types';

interface AdminProductFormModalProps {
  product?: ProductExtended | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: ProductExtended) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Instagram',
  'WhatsApp',
  'Portfolio',
  'Website',
  'Spotify',
  'YouTube',
  'Facebook',
  'Telegram',
  'X',
];

export const AdminProductFormModal: React.FC<AdminProductFormModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEditing = !!product;

  const [formData, setFormData] = useState<ProductExtended>(() => {
    if (product) return { ...product };
    const newId = `prod_${Date.now().toString(36)}`;
    return {
      id: newId,
      slug: 'new-keychain',
      name: '',
      description: '',
      price: 350,
      salePrice: 169,
      rating: 4.8,
      reviewsCount: 1,
      badge: 'New',
      category: 'Instagram',
      images: ['/images/photos/instagram_real_keychain.jpg'],
      colors: ['#18181B', '#FFFFFF'],
      variants: [
        {
          color: 'Matte Black',
          colorHex: '#18181B',
          stock: 50,
          images: [],
          sku: `SKU-${Date.now().toString(36).toUpperCase()}-1`,
        },
      ],
      stock: 50,
      material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
      dimensions: '35mm x 35mm x 5mm',
      nfcCompatible: true,
      nfcDestinationTypes: ['Instagram'],
      shippingInfo: 'Free shipping on orders above ₹499. Dispatched in 24 hours.',
      returnPolicy: '7-day replacement guarantee if chip does not read.',
      inStock: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const handleChange = (field: keyof ProductExtended, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name' && !isEditing) {
        // Auto generate slug
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleAddVariant = () => {
    const newVariant = {
      color: 'Custom Finish',
      colorHex: '#2563EB',
      stock: 25,
      images: [],
      sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
    };
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
      colors: Array.from(new Set([...prev.colors, newVariant.colorHex])),
    }));
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index: number, key: string, val: any) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [key]: val };
      return { ...prev, variants: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-teal tracking-wider">
              {isEditing ? 'Modify Product' : 'Add New Listing'}
            </span>
            <h2 className="text-xl font-extrabold text-brand-navy">
              {isEditing ? `Edit ${product.name}` : 'Create New NFC Keychain'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-200/70 hover:bg-neutral-300 transition-colors flex items-center justify-center text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* General Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-neutral-600">Product Title / Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Spotify NFC Keychain"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">URL Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand-teal outline-none font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">NFC Category *</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const cat = e.target.value as ProductCategory;
                  handleChange('category', cat);
                  handleChange('nfcDestinationTypes', [cat]);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand-teal outline-none bg-white font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">MRP (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm font-bold text-neutral-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-teal">Discount Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.salePrice || ''}
                onChange={(e) => handleChange('salePrice', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-brand-teal/40 text-sm font-extrabold text-brand-teal bg-teal-50/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Total Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Stock Status</label>
              <button
                type="button"
                onClick={() => handleChange('inStock', !formData.inStock)}
                className={`w-full py-2 rounded-lg text-xs font-bold transition-all border ${
                  formData.inStock
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                {formData.inStock ? 'In Stock' : 'Out of Stock'}
              </button>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-600">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detailed description of features, microchip, and styling..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:border-brand-teal outline-none"
            />
          </div>

          {/* Images Upload / Preview */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-200">
            <AdminImageUpload
              images={formData.images}
              onChange={(newImages) => handleChange('images', newImages)}
            />
          </div>

          {/* Variants Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Color Variants ({formData.variants.length})
              </label>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs font-bold text-brand-teal flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            <div className="space-y-2">
              {formData.variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200"
                >
                  <input
                    type="color"
                    value={variant.colorHex}
                    onChange={(e) => handleVariantChange(idx, 'colorHex', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(idx, 'color', e.target.value)}
                    placeholder="Color Name"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium"
                  />
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(idx, 'stock', Number(e.target.value))}
                    placeholder="Stock"
                    className="w-20 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-neutral-600">Material Specification</label>
              <input
                type="text"
                value={formData.material || ''}
                onChange={(e) => handleChange('material', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-neutral-600">Dimensions</label>
              <input
                type="text"
                value={formData.dimensions || ''}
                onChange={(e) => handleChange('dimensions', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-sm font-semibold hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-sm font-bold shadow-md shadow-brand-navy/20 transition-all hover:scale-[1.02]"
            >
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductFormModal;
