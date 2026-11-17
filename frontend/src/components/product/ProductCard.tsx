import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useStore';
import toast from 'react-hot-toast';
import type { ProductVariant } from '../../types';
import type { ProductExtended } from '../../data/products';
import { Keychain3D } from '../common/Keychain3D';

interface ProductCardProps {
  product: ProductExtended;
  variant?: ProductVariant;
  quickView?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const displayPrice = product.salePrice ?? product.price;
  const rating = product.rating || 4.8;
  const reviewsCount = product.reviewsCount || 100;
  const badge = product.badge;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      image: product.images[0] || '',
      price: product.price,
      salePrice: product.salePrice,
      quantity: 1,
      color: product.variants[0]?.color || 'Standard',
      customDestinationType: product.category,
      customDestinationUrl: `https://${product.category.toLowerCase()}.com/user`,
      customDestinationLabel: `@my_${product.category.toLowerCase()}`,
      subtotal: displayPrice,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const getBadgeStyle = () => {
    switch (badge) {
      case 'Bestseller':
        return 'bg-emerald-500 text-white';
      case 'New':
        return 'bg-blue-600 text-white';
      case 'Trending':
        return 'bg-rose-500 text-white';
      case 'Hot':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-neutral-800 text-white';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
      {/* Top Bar inside Card: Badge + Wishlist */}
      <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 z-20 flex items-center justify-between pointer-events-none">
        {badge ? (
          <span className={`text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs ${getBadgeStyle()}`}>
            {badge}
          </span>
        ) : (
          <span />
        )}

        <button
          onClick={handleWishlist}
          className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-neutral-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-neutral-400 hover:text-rose-500"
          title="Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
            }`}
          />
        </button>
      </div>

      {/* Product Visual Container */}
      <Link
        to={`/product/${product.slug}`}
        className="relative pt-4 sm:pt-6 pb-2 sm:pb-3 px-2 sm:px-4 flex items-center justify-center bg-gradient-to-b from-neutral-50/70 to-white min-h-[145px] sm:min-h-[205px] overflow-hidden"
      >
        {/* Subtle radial podium glow behind keychain */}
        <div className="absolute bottom-2 sm:bottom-3 w-24 sm:w-36 h-6 sm:h-8 rounded-full bg-neutral-200/50 blur-md group-hover:scale-125 transition-transform duration-500" />

        {/* Real Generated Studio Keychain Photo */}
        <div className="relative z-10 w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-108 group-hover:-rotate-2">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-md rounded-xl sm:rounded-2xl"
              loading="lazy"
            />
          ) : (
            <Keychain3D category={product.category} size="md" />
          )}
        </div>
      </Link>

      {/* Product Details Section */}
      <div className="p-2.5 sm:p-4 pt-1 flex flex-col gap-1.5 sm:gap-2">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 group-hover:text-brand-navy transition-colors truncate">
              {product.name}
            </h3>
            <span className="text-[8px] sm:text-[9px] font-bold text-[#0d9488] bg-teal-50 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
              Diamond
            </span>
          </div>
        </Link>

        {/* Price & Rating Row (Amazon / Flipkart Style) */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-baseline flex-wrap gap-1 sm:gap-1.5">
            <span className="text-sm sm:text-lg font-black text-neutral-900">
              ₹{displayPrice}
            </span>
            {product.price > displayPrice && (
              <>
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                  ₹{product.price}
                </span>
                <span className="text-[10px] sm:text-xs font-black text-emerald-600">
                  {Math.round(((product.price - displayPrice) / product.price) * 100)}% off
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-semibold text-neutral-600 shrink-0">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-neutral-400 font-normal hidden xs:inline sm:inline">({reviewsCount})</span>
          </div>
        </div>

        {/* Amazon/Flipkart Trust & Delivery Ribbon */}
        <div className="flex items-center justify-between gap-1 text-[9px] sm:text-[10px]">
          <span className="inline-flex items-center gap-1 font-bold text-sky-800 bg-sky-50 border border-sky-200/80 px-1.5 py-0.5 rounded-md italic">
            Assured <span className="text-emerald-600 font-black not-italic">✓</span>
          </span>
          <span className="text-emerald-700 font-semibold truncate">
            Free Delivery
          </span>
        </div>

        {/* Action Button: Quick Add / Customize */}
        <div className="pt-1 sm:pt-2 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 bg-neutral-100 hover:bg-[#0b1f3a] text-neutral-800 hover:text-white rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">Add to Cart</span>
          </button>

          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            className="p-1.5 sm:p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors shrink-0"
            title="Configure"
          >
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;