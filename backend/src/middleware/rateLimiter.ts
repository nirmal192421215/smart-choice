import rateLimit from 'express-rate-limit';
import { Request } from 'express';

/**
 * Per-route rate limiters for different API categories
 * Stricter limits on sensitive endpoints (auth, payments, admin)
 */

// Global API rate limiter (fallback for routes without specific limiters)
export const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
});

// Auth endpoints (signin, signup, signout, refresh) — strict
export const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
  },
  // Don't rate limit if already authenticated
  skip: (_req: Request): boolean => false,
});

// Payment endpoints (create-order, verify) — strict
export const paymentLimiter = rateLimit({
  windowMs: Number(process.env.PAYMENT_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.PAYMENT_RATE_LIMIT_MAX_REQUESTS) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many payment requests. Please try again later.',
  },
});

// Admin endpoints — moderate
export const adminLimiter = rateLimit({
  windowMs: Number(process.env.ADMIN_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.ADMIN_RATE_LIMIT_MAX_REQUESTS) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many admin requests. Please try again later.',
  },
});

// Cart endpoints — moderate (prevent abuse of cart validation)
export const cartLimiter = rateLimit({
  windowMs: Number(process.env.CART_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.CART_RATE_LIMIT_MAX_REQUESTS) || 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many cart requests. Please try again later.',
  },
});

// Order endpoints — moderate
export const orderLimiter = rateLimit({
  windowMs: Number(process.env.ORDER_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.ORDER_RATE_LIMIT_MAX_REQUESTS) || 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many order requests. Please try again later.',
  },
});

// Products read endpoints — generous (public catalog)
export const productReadLimiter = rateLimit({
  windowMs: Number(process.env.PRODUCT_READ_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.PRODUCT_READ_RATE_LIMIT_MAX_REQUESTS) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many product requests. Please try again later.',
  },
});

// Products write endpoints (admin only) — strict
export const productWriteLimiter = rateLimit({
  windowMs: Number(process.env.PRODUCT_WRITE_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.PRODUCT_WRITE_RATE_LIMIT_MAX_REQUESTS) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many product modification requests. Please try again later.',
  },
});