/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// ─────────────────────────────────────────────────────────────
// Smart Choice API Service
// Centralized Axios instance with auth interceptors and error handling
// ─────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────
// Attach auth token to every request; persistSession token from Supabase
api.interceptors.request.use(
  (config) => {
    // In production, the token would come from Supabase auth state
    // For now, we rely on the backend handling auth cookies/sessions
    // config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
  },
  (error) => {
    return Promise.reject(AxiosError.from(error));
  }
);

// ── Response Interceptor ─────────────────────────────────────
// Centralized error handling and auth token refresh
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const originalRequest = error.config as any;

    // ── Handle 401 (Unauthorized) ──
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // In production, would refresh Supabase session here
      // For now: just log and let the app handle it
      console.warn('🔒 Auth error or session expired');

      // Could redirect to login, clear stored auth, etc.
      // window.location.href = '/login';
    }

    // ── Handle 404 (Not Found) ──
    if (error.response?.status === 404) {
      console.warn('📡 Resource not found:', error.config?.url);
    }

    // ── Handle 429 (Rate Limited) ──
    if (error.response?.status === 429) {
      console.warn('⏳ Rate limit exceeded. Please retry later.');
    }

    // ── Generic Error ──
    return Promise.reject(error);
  }
);

// ── API Types ────────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ── API Methods ────────────────────────────────────────────────

export const apiGet = <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
  api.get(url, config).then((res) => res.data as ApiResponse<T>);

export const apiPost = <T, R = any>(url: string, data?: T, config?: AxiosRequestConfig) =>
  api.post(url, data, config);

export const apiPut = <T, R = any>(url: string, data?: T, config?: AxiosRequestConfig) =>
  api.put(url, data, config);

export const apiDelete = <R = any>(url: string, config?: AxiosRequestConfig) =>
  api.delete(url, config);

export const apiPatch = <T, R = any>(url: string, data?: T, config?: AxiosRequestConfig) =>
  api.patch(url, data, config);

// ── Product Endpoints ────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'created_at';
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const productsApi = {
  /** Get all products with optional filters and pagination */
  getAll: (params?: ProductSearchParams) =>
    apiGet<ApiResponse<any>>('/api/products', { params }),

  /** Get single product by ID */
  getById: (id: string) => apiGet<ApiResponse<any>>(`/api/products/${id}`),

  /** Get product by slug */
  getBySlug: (slug: string) => apiGet<ApiResponse<any>>(`/api/products/slug/${slug}`),

  /** Get products by category */
  getByCategory: (category: string) =>
    apiGet<ApiResponse<any>>(`/api/products/category/${category}`),

  /** Create product (admin) */
  create: (data: any) => apiPost<ApiResponse<any>, any>('/api/products', data),

  /** Update product (admin) */
  update: (id: string, data: any) => apiPut<ApiResponse<any>, any>(`/api/products/${id}`, data),

  /** Delete product (admin) */
  delete: (id: string) => apiDelete<ApiResponse<any>>(`/api/products/${id}`),
};

// ── Category Endpoints ────────────────────────────────────────

export const categoriesApi = {
  getAll: () => apiGet<ApiResponse<any>>('/api/categories'),
  getByName: (name: string) =>
    apiGet<ApiResponse<any>>(`/api/categories/name/${name}`),
};

// ── Cart Endpoints ────────────────────────────────────────────

export const cartApi = {
  getCart: () => apiGet<ApiResponse<any>>('/api/cart'),
  addItem: (item: any) => apiPost<ApiResponse<any>, any>('/api/cart', item),
  removeItem: (itemId: string) => apiDelete<ApiResponse<any>>(`/api/cart/${itemId}`),
  clearCart: () => apiDelete<ApiResponse<any>>('/api/cart'),
};

// ── Order Endpoints ───────────────────────────────────────────

export const ordersApi = {
  getAll: (userId?: string) =>
    apiGet<ApiResponse<any>>(`/api/orders${userId ? `?userId=${userId}` : ''}`),
  getById: (id: string) => apiGet<ApiResponse<any>>(`/api/orders/${id}`),
  create: (data: any) => apiPost<ApiResponse<any>, any>('/api/orders', data),
  updateStatus: (id: string, status: string, paymentStatus?: string) =>
    apiPatch<any, ApiResponse<any>>(
      `/api/orders/${id}/status`,
      { status, paymentStatus }
    ),
};

// ── Enquiry / Quote Request Endpoints ──────────────────────────

export interface EnquiryPayload {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  budget?: string;
  service?: string;
  message?: string;
}

export const enquiriesApi = {
  /** Submit a website enquiry / quote request */
  create: (data: EnquiryPayload) =>
    apiPost<EnquiryPayload, ApiResponse<any>>('/api/enquiries', data),
};

// ── Payment Endpoints ─────────────────────────────────────────

export const paymentsApi = {
  create: (data: any) => apiPost<ApiResponse<any>, any>('/api/payments', data),
  getByOrderId: (orderId: string) =>
    apiGet<ApiResponse<any>>(`/api/payments/order/${orderId}`),
};

// ── Auth Endpoints ────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiPost<any, ApiResponse<{ token: string }>>('/api/auth/login', { email, password }),

  register: (userData: any) =>
    apiPost<ApiResponse<{ user: any }>>('/api/auth/register', userData),

  logout: () => apiPost<ApiResponse<any>>('/api/auth/logout'),

  me: () => apiGet<ApiResponse<any>>('/api/auth/me'),
};

// ── Admin Endpoints ───────────────────────────────────────────

export const adminApi = {
  login: (email: string, password: string) =>
    apiPost<any, ApiResponse<{ token: string }>>('/api/admin/login', { email, password }),

  products: productsApi,

  categories: categoriesApi,

  coupons: {
    getAll: () => apiGet<ApiResponse<any>>('/api/admin/coupons'),
    validate: (code: string) =>
      apiGet<ApiResponse<any>>(`/api/admin/coupons/validate/${code}`),
    create: (coupon: any) => apiPost<ApiResponse<any>>('/api/admin/coupons', coupon),
    update: (id: string, updates: any) =>
      apiPatch<ApiResponse<any>>(`/api/admin/coupons/${id}`, updates),
    delete: (id: string) => apiDelete<ApiResponse<any>>(`/api/admin/coupons/${id}`),
  },

  paymentSettings: {
    get: () => apiGet<ApiResponse<any>>('/api/admin/payment-settings'),
    update: (updates: any) =>
      apiPatch<ApiResponse<any>>('/api/admin/payment-settings', updates),
    reset: () => apiPost<ApiResponse<any>>('/api/admin/payment-settings/reset'),
  },

  users: {
    getAll: () => apiGet<ApiResponse<any>>('/api/admin/users'),
    getById: (id: string) => apiGet<ApiResponse<any>>(`/api/admin/users/${id}`),
    create: (user: any) => apiPost<ApiResponse<any>>('/api/admin/users', user),
    update: (id: string, updates: any) =>
      apiPatch<ApiResponse<any>>(`/api/admin/users/${id}`, updates),
    delete: (id: string) => apiDelete<ApiResponse<any>>(`/api/admin/users/${id}`),
  },

  orders: {
    getAll: () => apiGet<ApiResponse<any>>('/api/admin/orders'),
    getById: (id: string) => apiGet<ApiResponse<any>>(`/api/admin/orders/${id}`),
    updateStatus: (id: string, status: string, paymentStatus?: string) =>
      apiPatch<any, ApiResponse<any>>(`/api/admin/orders/${id}/status`, {
        status,
        paymentStatus,
      }),
  },

  productsStock: {
    toggle: (id: string) =>
      apiPatch<ApiResponse<any>>(`/api/admin/products/${id}/stock`),
  },

  productsPrices: {
    bulkUpdate: (mrp: number, salePrice: number) =>
      apiPatch<any, ApiResponse<any>>('/api/admin/products/prices', { mrp, salePrice }),
  },
};

// ── Utility ──────────────────────────────────────────────────

export const formatApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'API request failed';
  }
  return String(error);
};

export default api;