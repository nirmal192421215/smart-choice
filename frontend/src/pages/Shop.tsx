import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminProducts } from '../hooks/useAdminStore';
import ProductCard from '../components/product/ProductCard';
import { Search, SlidersHorizontal, Radio, X } from 'lucide-react';
import type { ProductCategory } from '../types';

const CATEGORY_TABS: (ProductCategory | 'All')[] = [
  'All',
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

export const Shop = () => {
  const { products: storeProducts } = useAdminProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as ProductCategory) || 'All';

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(
    CATEGORY_TABS.includes(initialCategory) ? initialCategory : 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return 0; // featured default
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (category: ProductCategory | 'All') => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A142F]">
      {/* Header Banner — Matching Option 3 Iridescent Pastel Theme */}
      <section className="page-pastel-hero relative border-b border-white/80 py-14 md:py-20 px-6 overflow-hidden">
        {/* Soft ambient glow orbs */}
        <div className="absolute top-[-60px] left-[15%] w-[350px] h-[350px] rounded-full bg-sky-300/30 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-50px] right-[15%] w-[380px] h-[380px] rounded-full bg-amber-200/35 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10.5px] font-bold tracking-[0.18em] uppercase text-white shadow-sm"
            style={{ background: 'linear-gradient(90deg, #00d2ff, #0099ff)' }}>
            <Radio className="w-3 h-3 text-white" />
            <span>OFFICIAL COLLECTION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0A142F] tracking-tight leading-tight">
            NFC Keychains Catalog<br />
            <span style={{
              background: 'linear-gradient(90deg, #0084ff 0%, #00d2ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Choose Your Signature Tap.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#475569] max-w-2xl mx-auto font-medium leading-relaxed">
            Handcrafted with precision 3D printing and equipped with high-speed rewritable NTAG215 microchips.
            Works on all modern iPhone &amp; Android devices with zero apps needed.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="glass-card rounded-[28px] p-5 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {CATEGORY_TABS.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'text-white shadow-md scale-[1.02]'
                        : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-neutral-900 border border-neutral-200/60'
                    }`}
                    style={isActive ? {
                      background: 'linear-gradient(90deg, #00d2ff, #0099ff)',
                      boxShadow: '0 4px 16px rgba(0, 150, 255, 0.3)'
                    } : {}}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search keychains..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-white/90 border border-neutral-200/80 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:border-[#0099ff] shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/90 border border-neutral-200/80 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 shadow-xs cursor-pointer"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="pb-4 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <span>
            Showing <strong className="text-[#0A142F]">{filteredProducts.length}</strong> of{' '}
            {storeProducts.length} keychains
          </span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => handleCategoryChange('All')}
              className="text-[#0099ff] hover:underline font-bold"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Product Cards Grid - 2 in a row on mobile */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pt-2 pb-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} quickView={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card rounded-3xl my-8 space-y-4">
            <Radio className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-[#0A142F]">No Keychains Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              We couldn't find any keychains matching your current search "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-105"
              style={{ background: 'linear-gradient(90deg, #00d2ff, #0099ff)' }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
export default Shop;
