import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * CSRF Protection Middleware
 * Implements the "double-submit cookie" pattern:
 * - Server sets a random CSRF token in a cookie (HttpOnly, SameSite=Strict)
 * - Client must send the same token in a custom header (X-CSRF-Token)
 * - On state-changing requests (POST/PUT/PATCH/DELETE), header must match cookie
 *
 * This is a defense-in-depth measure on top of SameSite cookies.
 */

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

// Routes that are exempt from CSRF (e.g., webhook endpoints, public GETs)
const CSRF_EXEMPT_PATHS = [
  '/health',
  '/api/products',
  '/api/categories',
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/payments/create-order',
  '/api/payments/verify',
];

// State-changing methods that require CSRF validation
const STATE_CHANGING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Generate a cryptographically secure CSRF token
 */
export const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Set the CSRF cookie on the response
 */
export const setCsrfCookie = (res: Response): string => {
  const token = generateCsrfToken();
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_COOKIE_MAX_AGE,
  });
  return token;
};

/**
 * CSRF protection middleware
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method.toUpperCase();

  // Only validate state-changing methods
  if (!STATE_CHANGING_METHODS.includes(method)) {
    return next();
  }

  // Check if path is exempt
  const isExempt = CSRF_EXEMPT_PATHS.some((path) => req.path === path);
  if (isExempt) {
    return next();
  }

  const cookieToken = req.signedCookies?.[CSRF_COOKIE_NAME] || req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  // If no cookie token, issue one and allow the request (first-time setup)
  if (!cookieToken) {
    const newToken = setCsrfCookie(res);
    req.csrfToken = newToken;
    return next();
  }

  // If header token is missing, reject
  if (!headerToken) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token missing. Please include X-CSRF-Token header.',
    });
  }

  // Compare tokens using constant-time comparison to prevent timing attacks
  const cookieTokenStr =
    typeof cookieToken === 'string' ? cookieToken : (cookieToken as string[])[0] || '';
  const headerTokenStr =
    typeof headerToken === 'string' ? headerToken : (headerToken as string[])[0] || '';
  if (
    cookieTokenStr.length > 0 &&
    headerTokenStr.length > 0 &&
    !crypto.timingSafeEqual(
      Buffer.from(cookieTokenStr, 'utf8'),
      Buffer.from(headerTokenStr, 'utf8')
    )
  ) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token mismatch. Please refresh the page and try again.',
    });
  }

  next();
};

/**
 * Middleware to expose CSRF token to the client (for frontend integration)
 * Sets X-CSRF-Token response header so the client can read it
 */
export const exposeCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  const cookieToken = req.signedCookies?.[CSRF_COOKIE_NAME] || req.cookies?.[CSRF_COOKIE_NAME];
  if (cookieToken) {
    res.setHeader(CSRF_HEADER_NAME, cookieToken);
  }
  next();
};

// Extend Express Request type
declare module 'express' {
  interface Request {
    csrfToken?: string;
  }
}

export default csrfProtection;