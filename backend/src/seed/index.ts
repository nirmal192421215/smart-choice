// ─────────────────────────────────────────────────────────────
// Smart Choice Backend — Seed Script
// Populates database with initial categories, products, coupons,
// and admin/customer profiles.
// Run: npm run seed
// ─────────────────────────────────────────────────────────────

import { supabaseAdmin } from '../config/supabase';
import dotenv from 'dotenv';

dotenv.config();

// ─── Categories Seed Data ───────────────────────────────────
const SEED_CATEGORIES = [
  { id: 'cat_001', name: 'Instagram', slug: 'instagram', description: 'Share your visual content and profile instantly', color: '#E1306C' },
  { id: 'cat_002', name: 'WhatsApp', slug: 'whatsapp', description: 'Instant contact and direct messaging', color: '#25D366' },
  { id: 'cat_003', name: 'Portfolio', slug: 'portfolio', description: 'Showcase dev projects, designs, and CVs', color: '#18181B' },
  { id: 'cat_004', name: 'Website', slug: 'website', description: 'Send anyone to your landing page or store', color: '#2563EB' },
  { id: 'cat_005', name: 'Spotify', slug: 'spotify', description: 'Play your music, podcast, or album on tap', color: '#1DB954' },
  { id: 'cat_006', name: 'YouTube', slug: 'youtube', description: 'Gain subscribers and showcase your videos', color: '#FF0000' },
  { id: 'cat_007', name: 'Facebook', slug: 'facebook', description: 'Connect on social media and pages', color: '#1877F2' },
  { id: 'cat_008', name: 'Telegram', slug: 'telegram', description: 'Join channel or chat directly', color: '#2AABEE' },
  { id: 'cat_009', name: 'X', slug: 'x', description: 'Follow on X with one touch', color: '#18181B' },
];

// ─── Products Seed Data (matches frontend mock data) ─────────
const SEED_PRODUCTS = [
  {
    id: 'prod_005',
    slug: 'spotify-nfc-keychain',
    name: 'Spotify NFC Keychain',
    description:
      'Instantly share your favorite track, playlist, album, or artist profile with a single tap. Handcrafted with precision 3D printing and equipped with high-speed passive NTAG215 microchip.',
    price: 350,
    salePrice: 169,
    category: 'Spotify',
    images: [
      '/images/photos/spotify_real_keychain.png',
      '/images/real_spotify_keychain.jpg',
      '/images/hero_spotify_keychain.jpg',
      '/images/backpack_keychain.jpg',
    ],
    colors: ['#1DB954', '#18181B', '#FFFFFF', '#0B1F3A'],
    variants: [
      { color: 'Spotify Green', colorHex: '#1DB954', stock: 50, sku: 'SPOT-GRN-001' },
      { color: 'Matte Onyx Black', colorHex: '#18181B', stock: 35, sku: 'SPOT-BLK-001' },
      { color: 'Frost White', colorHex: '#FFFFFF', stock: 25, sku: 'SPOT-WHT-001' },
    ],
    stock: 110,
    material: 'Premium PLA 3D Printed + High-Speed NTAG215 Chip',
    dimensions: '36mm x 36mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['Spotify'],
    shippingInfo: 'Free shipping on orders above ₹499. Dispatched in 24 hours across India.',
    returnPolicy: '7-day replacement guarantee if chip does not read.',
    inStock: true,
    rating: 4.8,
    reviewsCount: 120,
    badge: 'Bestseller',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_001',
    slug: 'instagram-nfc-keychain',
    name: 'Instagram NFC Keychain',
    description:
      'Share your Instagram handle in a split second. Tap against any iPhone or Android phone to instantly open your profile or reel. Dual-color embossed design.',
    price: 350,
    salePrice: 169,
    category: 'Instagram',
    images: [
      '/images/photos/instagram_real_keychain.jpg',
      '/images/real_instagram_keychain.jpg',
      '/images/backpack_keychain.jpg',
      '/images/real_batch_keychains.png',
    ],
    colors: ['#F472B6', '#E1306C', '#18181B', '#FFFFFF'],
    variants: [
      { color: 'Soft Blossom Pink', colorHex: '#F472B6', stock: 40, sku: 'INST-PNK-001' },
      { color: 'Sunset Magenta', colorHex: '#E1306C', stock: 30, sku: 'INST-MAG-001' },
      { color: 'Midnight Black', colorHex: '#18181B', stock: 25, sku: 'INST-BLK-001' },
    ],
    stock: 95,
    material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
    dimensions: '35mm x 35mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['Instagram'],
    shippingInfo: 'Free shipping on orders above ₹499. Dispatched in 24 hours across India.',
    returnPolicy: '7-day replacement guarantee.',
    inStock: true,
    rating: 4.7,
    reviewsCount: 98,
    badge: 'New',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_003',
    slug: 'portfolio-nfc-keychain',
    name: 'Portfolio NFC Keychain',
    description:
      'Showcase your coding projects, GitHub, Behance or personal portfolio website to recruiters and clients on the fly with a single physical tap.',
    price: 350,
    salePrice: 169,
    category: 'Portfolio',
    images: [
      '/images/photos/portfolio_real_keychain.jpg',
      '/images/real_batch_keychains.png',
      '/images/backpack_keychain.jpg',
    ],
    colors: ['#18181B', '#2563EB', '#0D9488', '#FFFFFF'],
    variants: [
      { color: 'Developer Slate', colorHex: '#18181B', stock: 30, sku: 'PORT-SLT-001' },
      { color: 'Cyber Cobalt', colorHex: '#2563EB', stock: 20, sku: 'PORT-BLU-001' },
    ],
    stock: 50,
    material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
    dimensions: '35mm x 35mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['Portfolio'],
    shippingInfo: 'Free shipping on orders above ₹499.',
    returnPolicy: '7-day replacement guarantee.',
    inStock: true,
    rating: 4.6,
    reviewsCount: 76,
    badge: 'Popular',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_004',
    slug: 'website-nfc-keychain',
    name: 'Website NFC Keychain',
    description:
      'Direct people directly to your business website, startup landing page, Linktree, or portfolio link. Zero app downloads required for the recipient.',
    price: 350,
    salePrice: 169,
    category: 'Website',
    images: [
      '/images/photos/website_real_keychain.jpg',
      '/images/real_batch_keychains.png',
      '/images/phone_tap_nfc.jpg',
    ],
    colors: ['#2563EB', '#0B1F3A', '#24B8A6', '#FFFFFF'],
    variants: [
      { color: 'Electric Blue', colorHex: '#2563EB', stock: 35, sku: 'WEB-BLU-001' },
      { color: 'Obsidian Navy', colorHex: '#0B1F3A', stock: 25, sku: 'WEB-NAV-001' },
    ],
    stock: 60,
    material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
    dimensions: '35mm x 35mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['Website'],
    shippingInfo: 'Free shipping on orders above ₹499.',
    returnPolicy: '7-day replacement guarantee.',
    inStock: true,
    rating: 4.7,
    reviewsCount: 63,
    badge: 'Trending',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_006',
    slug: 'youtube-nfc-keychain',
    name: 'YouTube NFC Keychain',
    description:
      'Boost your YouTube subscriber count seamlessly. Tap phone to open your latest video or channel subscribe page directly inside the YouTube app.',
    price: 350,
    salePrice: 169,
    category: 'YouTube',
    images: [
      '/images/photos/youtube_real_keychain.jpg',
      '/images/real_batch_keychains.png',
      '/images/phone_tap_nfc.jpg',
    ],
    colors: ['#FF0000', '#18181B', '#FFFFFF'],
    variants: [
      { color: 'Vibrant Crimson Red', colorHex: '#FF0000', stock: 45, sku: 'YT-RED-001' },
      { color: 'Stealth Black', colorHex: '#18181B', stock: 20, sku: 'YT-BLK-001' },
    ],
    stock: 65,
    material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
    dimensions: '35mm x 35mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['YouTube'],
    shippingInfo: 'Free shipping on orders above ₹499.',
    returnPolicy: '7-day replacement guarantee.',
    inStock: true,
    rating: 4.8,
    reviewsCount: 101,
    badge: 'Bestseller',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_007',
    slug: 'facebook-nfc-keychain',
    name: 'Facebook NFC Keychain',
    description:
      'Connect with friends and family or send clients to your official business page. High strength metallic ring and vibrant blue dual-layer body.',
    price: 350,
    salePrice: 169,
    category: 'Facebook',
    images: [
      '/images/photos/facebook_real_keychain.jpg',
      '/images/real_batch_keychains.png',
      '/images/backpack_keychain.jpg',
    ],
    colors: ['#1877F2', '#18181B', '#FFFFFF'],
    variants: [
      { color: 'Facebook Royal Blue', colorHex: '#1877F2', stock: 30, sku: 'FB-BLU-001' },
    ],
    stock: 40,
    material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
    dimensions: '35mm x 35mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['Facebook'],
    shippingInfo: 'Free shipping on orders above ₹499.',
    returnPolicy: '7-day replacement guarantee.',
    inStock: true,
    rating: 4.6,
    reviewsCount: 54,
    badge: 'Hot',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_002',
    slug: 'whatsapp-nfc-keychain',
    name: 'WhatsApp NFC Keychain',
    description:
      'Get instant WhatsApp contact sharing. Tap to open WhatsApp with your phone number pre-filled and customized greeting. Perfect for sales & networking.',
    price: 350,
    salePrice: 169,
    category: 'WhatsApp',
    images: [
      '/images/photos/whatsapp_real_keychain.jpg',
      '/images/real_batch_keychains.png',
      '/images/phone_tap_nfc.jpg',
    ],
    colors: ['#25D366', '#128C7E', '#18181B', '#FFFFFF'],
    variants: [
      { color: 'WhatsApp Green', colorHex: '#25D366', stock: 60, sku: 'WHT-GRN-001' },
      { color: 'Deep Teal', colorHex: '#128C7E', stock: 30, sku: 'WHT-TEA-001' },
    ],
    stock: 90,
    material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
    dimensions: '35mm x 35mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['WhatsApp'],
    shippingInfo: 'Free shipping on orders above ₹499.',
    returnPolicy: '7-day replacement guarantee.',
    inStock: true,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Bestseller',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_008',
    slug: 'telegram-nfc-keychain',
    name: 'Telegram NFC Keychain',
    description:
      'Share your Telegram channel, group link, or private username instantly with anyone. Built with durable 3D printed PLA in electric Telegram blue.',
    price: 350,
    salePrice: 169,
    category: 'Telegram',
    images: [
      '/images/photos/telegram_real_keychain.jpg',
      '/images/real_batch_keychains.png',
      '/images/backpack_keychain.jpg',
    ],
    colors: ['#2AABEE', '#18181B', '#FFFFFF'],
    variants: [
      { color: 'Telegram Blue', colorHex: '#2AABEE', stock: 35, sku: 'TG-BLU-001' },
    ],
    stock: 45,
    material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
    dimensions: '35mm x 35mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['Telegram'],
    shippingInfo: 'Free shipping on orders above ₹499.',
    returnPolicy: '7-day replacement guarantee.',
    inStock: true,
    rating: 4.7,
    reviewsCount: 42,
    badge: 'Trending',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_009',
    slug: 'x-nfc-keychain',
    name: 'X (Twitter) NFC Keychain',
    description:
      'Link directly to your X handle or top tweet. Minimalist matte black casing with crisp white dual-extrusion X insignia and premium metallic split ring.',
    price: 350,
    salePrice: 169,
    category: 'X',
    images: [
      '/images/photos/x_real_keychain.jpg',
      '/images/real_batch_keychains.png',
      '/images/gift_box_keychain.jpg',
    ],
    colors: ['#18181B', '#FFFFFF'],
    variants: [
      { color: 'Matte Onyx Black', colorHex: '#18181B', stock: 40, sku: 'X-BLK-001' },
    ],
    stock: 55,
    material: 'High-precision Dual PLA + NTAG215 NFC Transponder',
    dimensions: '35mm x 35mm x 5mm',
    nfcCompatible: true,
    nfcDestinationTypes: ['X'],
    shippingInfo: 'Free shipping on orders above ₹499.',
    returnPolicy: '7-day replacement guarantee.',
    inStock: true,
    rating: 4.8,
    reviewsCount: 89,
    badge: 'Popular',
    updatedAt: new Date().toISOString(),
  },
];

// ─── Coupons Seed Data ──────────────────────────────────────
const SEED_COUPONS = [
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
    maxDiscount: 200,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// ─── Profiles Seed Data ─────────────────────────────────────
const SEED_PROFILES = [
  {
    id: 'admin_001',
    email: 'admin@smartchoice.in',
    name: 'Admin User',
    role: 'admin',
    addresses: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'customer_001',
    email: 'customer@smartchoice.in',
    name: 'Test Customer',
    role: 'customer',
    addresses: [],
    createdAt: new Date().toISOString(),
  },
];

// ─── Seed Functions ─────────────────────────────────────────

async function seedCategories() {
  console.log('📂 Seeding categories...');
  for (const category of SEED_CATEGORIES) {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .upsert(category, { onConflict: 'id' });

      if (error) throw error;
      console.log(`   ✅ ${category.name}`);
    } catch (err: any) {
      console.warn(`   ⚠️  Failed to seed category ${category.name}:`, err.message);
    }
  }
}

async function seedProducts() {
  console.log('📦 Seeding products...');
  for (const product of SEED_PRODUCTS) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .upsert(product, { onConflict: 'slug' });

      if (error) throw error;
      console.log(`   ✅ ${product.name} (${product.category})`);
    } catch (err: any) {
      console.warn(`   ⚠️  Failed to seed product ${product.name}:`, err.message);
    }
  }
}

async function seedCoupons() {
  console.log('🎟️  Seeding coupons...');
  for (const coupon of SEED_COUPONS) {
    try {
      const { data, error } = await supabaseAdmin
        .from('coupons')
        .upsert(coupon, { onConflict: 'code' });

      if (error) throw error;
      console.log(`   ✅ ${coupon.code}`);
    } catch (err: any) {
      console.warn(`   ⚠️  Failed to seed coupon ${coupon.code}:`, err.message);
    }
  }
}

async function seedProfiles() {
  console.log('👥 Seeding profiles...');
  for (const profile of SEED_PROFILES) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert(profile, { onConflict: 'email' });

      if (error) throw error;
      console.log(`   ✅ ${profile.email} (${profile.role})`);
    } catch (err: any) {
      console.warn(`   ⚠️  Failed to seed profile ${profile.email}:`, err.message);
    }
  }
}

// ─── Main ───────────────────────────────────────────────────
async function main() {
  console.log('🌱 Smart Choice Seed Script');
  console.log('============================');

  // Check if Supabase is configured
  const isConfigured =
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_URL.includes('your_supabase');

  if (!isConfigured) {
    console.warn('⚠️  Supabase not configured. Running in simulation mode.');
    console.warn('   Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to seed real data.');
    console.log('\n✅ Seed script completed (simulation mode - no data written).');
    return;
  }

  try {
    await seedProfiles();
    await seedCategories();
    await seedProducts();
    await seedCoupons();

    console.log('\n✅ Seed script completed successfully!');
    console.log(`   Categories: ${SEED_CATEGORIES.length}`);
    console.log(`   Products: ${SEED_PRODUCTS.length}`);
    console.log(`   Coupons: ${SEED_COUPONS.length}`);
    console.log(`   Profiles: ${SEED_PROFILES.length}`);
  } catch (err: any) {
    console.error('❌ Seed script failed:', err.message);
    process.exit(1);
  }
}

main();