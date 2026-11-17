import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProductExtended, GalleryImage } from '../data/products';
import type { ProductCategory } from '../types';
import type { Coupon } from '../types';
import { productsApi } from '../services/api';

// ─── NFC Destination Type ───
export interface NfcDestination {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  subtitle: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

// ─── Admin Auth Store ───
export interface AdminAuthStore {
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  lastLoginAt: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Hardcoded admin credentials (client-side only)
const ADMIN_EMAIL = 'nirmalkumar00727@gmail.com';
const ADMIN_PASSWORD = 'smartchoice@admin2024';

export const useAdminAuth = create<AdminAuthStore>()(
  persist(
    (set) => ({
      isAdminAuthenticated: false,
      adminEmail: null,
      lastLoginAt: null,
      login: (email: string, password: string) => {
        if (email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({
            isAdminAuthenticated: true,
            adminEmail: email,
            lastLoginAt: new Date().toISOString(),
          });
          return true;
        }
        return false;
      },
      logout: () => {
        sessionStorage.removeItem('admin-auth-storage');
        localStorage.removeItem('admin-auth-storage');
        set({
          isAdminAuthenticated: false,
          adminEmail: null,
          lastLoginAt: null,
        });
      },
    }),
    {
      name: 'admin-auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// ─── Admin Product Store ───
export interface AdminProductStore {
  products: ProductExtended[];
  isLoading: boolean;
  error: string | null;
  setProducts: (products: ProductExtended[]) => void;
  addProduct: (product: ProductExtended) => void;
  updateProduct: (productId: string, updates: Partial<ProductExtended>) => void;
  deleteProduct: (productId: string) => void;
  toggleProductStock: (productId: string) => void;
  bulkUpdatePrices: (mrp: number, salePrice: number) => void;
  getProductBySlug: (slug: string) => ProductExtended | undefined;
  getProductById: (id: string) => ProductExtended | undefined;

  // Async actions
  initProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export const useAdminProducts = create<AdminProductStore>()(
  persist(
    (set, get) => ({
      products: [], // Start empty — populated via API call
      isLoading: false,
      error: null,
      setProducts: (products) => set({ products }),
      addProduct: (product) =>
        set({ products: [...get().products, product] }),
      updateProduct: (productId, updates) =>
        set({
          products: get().products.map((p) =>
            p.id === productId
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }),
      deleteProduct: (productId) =>
        set({
          products: get().products.filter((p) => p.id !== productId),
        }),
      toggleProductStock: (productId) =>
        set({
          products: get().products.map((p) =>
            p.id === productId
              ? { ...p, inStock: !p.inStock, updatedAt: new Date().toISOString() }
              : p
          ),
        }),
      bulkUpdatePrices: (mrp, salePrice) =>
        set({
          products: get().products.map((p) => ({
            ...p,
            price: mrp,
            salePrice,
            updatedAt: new Date().toISOString(),
          })),
        }),
      getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
      getProductById: (id) => get().products.find((p) => p.id === id),

      // Initialize from API on first access, fall back to static mock data
      initProducts: async () => {
        if (get().products.length > 0) {
          return; // Already initialized
        }

        set({ isLoading: true, error: null });

        try {
          const response = await productsApi.getAll();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const responseAny = response as any;
          const apiData = responseAny?.data?.data ?? responseAny?.data;
          if (Array.isArray(apiData) && apiData.length > 0) {
            set({ products: apiData, isLoading: false });
          } else {
            // API returned empty or error — fall back to static mock data
            console.warn('API unavailable or empty, using mock data');
            const { PRODUCTS } = await import('../data/products');
            set({ products: PRODUCTS, error: null, isLoading: false });
          }
        } catch (err: any) {
          // Network error — fall back to static mock data
          console.warn('API unreachable, using mock data:', err?.message);
          const { PRODUCTS } = await import('../data/products');
          set({ products: PRODUCTS, error: null, isLoading: false });
        }
      },

      refreshProducts: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await productsApi.getAll();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const responseAny = response as any;
          const apiData = responseAny?.data?.data ?? responseAny?.data;
          if (Array.isArray(apiData) && apiData.length > 0) {
            set({ products: apiData, isLoading: false });
          } else {
            console.warn('API unavailable or empty, using mock data');
            const { PRODUCTS } = await import('../data/products');
            set({ products: PRODUCTS, error: null, isLoading: false });
          }
        } catch (err: any) {
          console.warn('API unreachable, using mock data:', err?.message);
          const { PRODUCTS } = await import('../data/products');
          set({ products: PRODUCTS, error: null, isLoading: false });
        }
      },
    }),
    {
      name: 'admin-products-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }),
    }
  )
);

// ─── Admin Destinations Store ───
// Seed categories for initial render; replaced by API call in initDestinations()
const DEFAULT_DESTINATIONS: NfcDestination[] = [
  { id: 'cat_001', name: 'Instagram', slug: 'instagram-nfc-keychain', icon: 'instagram', color: '#E1306C', subtitle: 'Grow Your Profile', description: 'Share your visual content and profile instantly', isActive: true, sortOrder: 0 },
  { id: 'cat_002', name: 'WhatsApp', slug: 'whatsapp-nfc-keychain', icon: 'whatsapp', color: '#25D366', subtitle: 'Stay in Touch', description: 'Instant contact and direct messaging', isActive: true, sortOrder: 1 },
  { id: 'cat_003', name: 'Portfolio', slug: 'portfolio-nfc-keychain', icon: 'portfolio', color: '#18181B', subtitle: 'Show Your Work', description: 'Showcase dev projects, designs, and CVs', isActive: true, sortOrder: 2 },
  { id: 'cat_004', name: 'Website', slug: 'website-nfc-keychain', icon: 'website', color: '#2563EB', subtitle: 'Share Your Website', description: 'Send anyone to your landing page or store', isActive: true, sortOrder: 3 },
  { id: 'cat_005', name: 'Spotify', slug: 'spotify-nfc-keychain', icon: 'spotify', color: '#1DB954', subtitle: 'Share Your Playlist', description: 'Play your music, podcast, or album on tap', isActive: true, sortOrder: 4 },
  { id: 'cat_006', name: 'YouTube', slug: 'youtube-nfc-keychain', icon: 'youtube', color: '#FF0000', subtitle: 'Grow Your Channel', description: 'Gain subscribers and showcase your videos', isActive: true, sortOrder: 5 },
  { id: 'cat_007', name: 'Facebook', slug: 'facebook-nfc-keychain', icon: 'facebook', color: '#1877F2', subtitle: 'Connect with Friends', description: 'Connect on social media and pages', isActive: true, sortOrder: 6 },
  { id: 'cat_008', name: 'Telegram', slug: 'telegram-nfc-keychain', icon: 'telegram', color: '#2AABEE', subtitle: 'Fast Messaging', description: 'Join channel or chat directly', isActive: true, sortOrder: 7 },
  { id: 'cat_009', name: 'X', slug: 'x-nfc-keychain', icon: 'x', color: '#18181B', subtitle: 'Share Your Feed', description: 'Follow on X with one touch', isActive: true, sortOrder: 8 },
];

export interface AdminDestinationStore {
  destinations: NfcDestination[];
  setDestinations: (destinations: NfcDestination[]) => void;
  addDestination: (destination: NfcDestination) => void;
  updateDestination: (id: string, updates: Partial<NfcDestination>) => void;
  deleteDestination: (id: string) => void;
  toggleDestination: (id: string) => void;
  reorderDestination: (id: string, direction: 'up' | 'down') => void;
  initDestinations: () => Promise<void>; // Async fetch from API
}

export const useAdminDestinations = create<AdminDestinationStore>()(
  persist(
    (set, get) => ({
      destinations: DEFAULT_DESTINATIONS,
      setDestinations: (destinations) => set({ destinations }),
      addDestination: (destination) =>
        set({ destinations: [...get().destinations, destination] }),
      updateDestination: (id, updates) =>
        set({
          destinations: get().destinations.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        }),
      deleteDestination: (id) =>
        set({
          destinations: get().destinations.filter((d) => d.id !== id),
        }),
      toggleDestination: (id) =>
        set({
          destinations: get().destinations.map((d) =>
            d.id === id ? { ...d, isActive: !d.isActive } : d
          ),
        }),
      reorderDestination: (id, direction) => {
        const dests = [...get().destinations].sort((a, b) => a.sortOrder - b.sortOrder);
        const idx = dests.findIndex((d) => d.id === id);
        if (idx === -1) return;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= dests.length) return;
        const tempOrder = dests[idx].sortOrder;
        dests[idx] = { ...dests[idx], sortOrder: dests[swapIdx].sortOrder };
        dests[swapIdx] = { ...dests[swapIdx], sortOrder: tempOrder };
        set({ destinations: dests });
      },
      initDestinations: async () => {
        // Destinations are static/local — no API needed
      },
    }),
    {
      name: 'admin-destinations-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── Admin Coupons Store ───
const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coup_001',
    code: 'SMART10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: 100,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'coup_002',
    code: 'FIRSTBUY',
    discountType: 'fixed',
    discountValue: 200,
    minOrderValue: 500,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export interface AdminCouponStore {
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCoupon: (id: string) => void;
}

export const useAdminCoupons = create<AdminCouponStore>()(
  persist(
    (set, get) => ({
      coupons: DEFAULT_COUPONS,
      setCoupons: (coupons) => set({ coupons }),
      addCoupon: (coupon) =>
        set({ coupons: [...get().coupons, coupon] }),
      updateCoupon: (id, updates) =>
        set({
          coupons: get().coupons.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }),
      deleteCoupon: (id) =>
        set({
          coupons: get().coupons.filter((c) => c.id !== id),
        }),
      toggleCoupon: (id) =>
        set({
          coupons: get().coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        }),
    }),
    {
      name: 'admin-coupons-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ─── Admin Payment & UPI Settings Store ───
export interface AdminPaymentSettings {
  upiId: string;
  payeeName: string;
  phone: string;
  qrImageUrl: string;
  enableUpiQr: boolean;
  enableCod: boolean;
  instructions: string;
}

const DEFAULT_PAYMENT_SETTINGS: AdminPaymentSettings = {
  upiId: '9342626096@ybl',
  payeeName: 'NIRMAL KUMAR N',
  phone: '9342626096',
  qrImageUrl: '/images/nirmal_phonepe_qr.png',
  enableUpiQr: true,
  enableCod: true,
  instructions: 'Scan with PhonePe, Google Pay, Paytm, CRED or any UPI app, complete the payment, and enter your 12-digit UPI UTR / Ref Number below to verify.',
};

export interface AdminPaymentStore {
  settings: AdminPaymentSettings;
  updateSettings: (updates: Partial<AdminPaymentSettings>) => void;
  resetSettings: () => void;
}

export const useAdminPaymentSettings = create<AdminPaymentStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_PAYMENT_SETTINGS,
      updateSettings: (updates) =>
        set({ settings: { ...get().settings, ...updates } }),
      resetSettings: () => set({ settings: DEFAULT_PAYMENT_SETTINGS }),
    }),
    {
      name: 'admin-payment-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

