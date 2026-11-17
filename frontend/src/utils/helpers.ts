export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyWithPaise(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPrice(price: number, salePrice?: number): string {
  if (salePrice && salePrice < price) {
    return formatCurrency(salePrice);
  }
  return formatCurrency(price);
}

export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter((input): input is string => typeof input === 'string')
    .join(' ')
    .trim();
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidMobile(mobile: string): boolean {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
}

export function isValidPinCode(pinCode: string): boolean {
  const pinRegex = /^\d{6}$/;
  return pinRegex.test(pinCode);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isWhatsAppUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'wa.me' || parsed.hostname === 'api.whatsapp.com';
  } catch {
    return false;
  }
}

export function getYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function getSpotifyTrackId(url: string): string | null {
  const regex = /open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStockStatus(stock: number): {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  label: string;
} {
  if (stock === 0) return { status: 'out-of-stock', label: 'Out of Stock' };
  if (stock <= 5) return { status: 'low-stock', label: 'Low Stock' };
  return { status: 'in-stock', label: 'In Stock' };
}

export function getDiscountPercentage(price: number, salePrice: number): number {
  if (!price || price <= salePrice) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
}

export function getStoredValue<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStoredValue<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to store value:', error);
  }
}

export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'Pending Payment': 'Pending Payment',
    'Confirmed': 'Confirmed',
    'Processing': 'Processing',
    'Ready to Ship': 'Ready to Ship',
    'Shipped': 'Shipped',
    'Delivered': 'Delivered',
    'Cancelled': 'Cancelled',
  };
  return statusMap[status] || status;
}

export function getPaymentMethodLabel(method: string): string {
  const methodMap: Record<string, string> = {
    razorpay: 'Online Payment',
    cod: 'Cash on Delivery',
  };
  return methodMap[method] || method;
}