export type ProductCategory =
  | 'Instagram'
  | 'WhatsApp'
  | 'Portfolio'
  | 'Website'
  | 'Spotify'
  | 'YouTube'
  | 'Facebook'
  | 'Telegram'
  | 'X';

export type ProductVariant = {
  color: string;
  colorHex: string;
  stock: number;
  images: string[];
  sku?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
  images: string[];
  colors: string[];
  variants: ProductVariant[];
  stock: number;
  dimensions?: string;
  material?: string;
  nfcCompatible: boolean;
  nfcDestinationTypes: ProductCategory[];
  shippingInfo?: string;
  returnPolicy?: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  color: string;
  variantId?: string;
  customDestinationType: ProductCategory | 'Other';
  customDestinationUrl: string;
  customDestinationLabel: string;
  subtotal: number;
};

export type ShippingAddress = {
  name: string;
  mobile: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
};

export type OrderStatus =
  | 'Pending Payment'
  | 'Confirmed'
  | 'Processing'
  | 'Ready to Ship'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed';

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCharges: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'razorpay' | 'cod' | 'upi_qr';
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  upiTransactionId?: string;
  upiPayee?: string;
  paymentProof?: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: ShippingAddress[];
  createdAt: string;
};

export type Category = {
  id: string;
  name: ProductCategory;
  description: string;
  image: string;
  createdAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
};

export type CustomerEnquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: string;
};

export type AnnouncementBar = {
  id: string;
  text: string;
  isActive: boolean;
};

export type SiteSettings = {
  announcementBar: AnnouncementBar;
  whatsappNumber: string;
  whatsappMessage: string;
  featuredProductIds: string[];
};

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
};