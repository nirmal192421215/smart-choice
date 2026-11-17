import { Request, Response, NextFunction } from 'express';
import { body, validationResult, query } from 'express-validator';

/**
 * Centralized input validation & sanitization pipeline.
 * Reusable across product/category/cart/order creation routes so every
 * handler runs the same, consistent rules.
 */

const MAX_NAME_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_PHONE_LENGTH = 15;

// ── Product-level validators ────────────────────────────────────
export const productValidators = [
  body('name')
    .trim()
    .isLength({ min: 1, max: MAX_NAME_LENGTH })
    .withMessage(`name must be between 1 and ${MAX_NAME_LENGTH} characters`)
    .toLowerCase(),
  body('description')
    .trim()
    .isLength({ max: MAX_DESCRIPTION_LENGTH })
    .withMessage(`description must be at most ${MAX_DESCRIPTION_LENGTH} characters`),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('price must be a non-negative number'),
  body('mrp')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('mrp must be a non-negative number'),
  body('slug')
    .trim()
    .notEmpty()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('slug must contain only lowercase letters, numbers and hyphens'),
];

// ── Category-level validators ───────────────────────────────────
export const categoryValidators = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('category name must be 1–100 characters'),
];

// ── Cart-item validator (flat productId/quantity) ──────────────────────────────────────────
export const cartItemValidator = [
  body('productId')
    .trim()
    .notEmpty()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('productId must contain only letters, numbers, hyphens and underscores'),
  body('quantity')
    .isInt({ min: 1, max: 999 })
    .withMessage('quantity must be an integer between 1 and 999'),
];

// ── Cart-item array validator (items[] with nested productId/quantity) ──────────────────────────────────────────
export const cartItemArrayValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('items must be a non-empty array'),
  // Validate each item in the array using wildcard paths
  body('items[*].productId')
    .optional()
    .trim()
    .notEmpty()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('productId must contain only letters, numbers, hyphens and underscores'),
  body('items[*].quantity')
    .optional()
    .isInt({ min: 1, max: 999 })
    .withMessage('quantity must be an integer between 1 and 999'),
  body('items[*].price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('price must be a non-negative number'),
];

// ── Enquiry validators (website quote-request popup) ───────────
export const enquiryValidators = [
  body('name')
    .trim()
    .isLength({ min: 1, max: MAX_NAME_LENGTH })
    .withMessage(`name must be between 1 and ${MAX_NAME_LENGTH} characters`),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('phone is required')
    .isLength({ min: 10, max: MAX_PHONE_LENGTH })
    .withMessage(`phone must be 10–${MAX_PHONE_LENGTH} digits`)
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('phone must contain only digits, spaces and + - ( )'),
  body('email')
    .optional()
    .trim()
    .isLength({ max: MAX_EMAIL_LENGTH })
    .withMessage(`email must be at most ${MAX_EMAIL_LENGTH} characters`)
    .isEmail()
    .withMessage('email is not a valid email address')
    .normalizeEmail(),
  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('city must be at most 100 characters'),
  body('budget')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('budget must be at most 100 characters'),
  body('service')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('service must be at most 200 characters'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: MAX_MESSAGE_LENGTH })
    .withMessage(`message must be at most ${MAX_MESSAGE_LENGTH} characters`),
];

// ── Auth validators (email + password) ───────────────────────────
export const emailValidator = [
  body('email')
    .trim()
    .isLength({ max: MAX_EMAIL_LENGTH })
    .withMessage(`email must be at most ${MAX_EMAIL_LENGTH} characters`)
    .isEmail()
    .withMessage('email is not a valid email address')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
];

// ── Query validators for products list ─────────────────────────
export const productQueryValidator = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('search query must be at most 200 characters'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a non-negative number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a non-negative number'),
  query('sortBy')
    .optional()
    .isIn(['price_asc', 'price_desc', 'created_at'])
    .withMessage('sortBy must be one of price_asc, price_desc, created_at'),
];

/**
 * Apply all validators in a chain to a single route.
 * Returns early with a JSON 400 response when any validation fails.
 */
/**
 * Express-validator's ValidationError is a discriminated union over a few shapes
 * (AlternativeValidationError for `body('x')` chains, etc.).
 * Each common case carries `{ field, msg }`; we normalize to that shape here.
 */
export const validateRequest = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all provided validators; merge results into one error bag
    const validateErrors = await Promise.all(validations.map((v) => v.run(req)));
    const merged = validationResult(req);
    // Merge per-validator errors into a flat array of { field, msg }
    const errors: Array<{ field?: string; msg?: string }> = [];
    validateErrors.forEach((ve: any[]) => {
      if (Array.isArray(ve)) {
        ve.forEach((e: any) => {
          // Express-validator's Output types differ by shape; accept and flatten
          const f = (e as any).field ?? (e as any).path;
          const m = (e as any).msg;
          if (f !== undefined && m !== undefined) errors.push({ field: f, msg: m });
        });
      } else if (ve) {
        // Some validators return a single error object instead of array
        const f = (ve as any).field ?? (ve as any).path;
        const m = (ve as any).msg;
        if (f !== undefined && m !== undefined) errors.push({ field: f, msg: m });
      }
    });
    const allErrors: Array<{ field?: string; msg?: string }> = errors;
    if (!merged.isEmpty()) {
      allErrors.push(...merged.array().map((e: any) => ({ field: e.path, msg: e.msg })));
    }
    // Coerce to fully-typed output and keep only complete entries
    const outputErrors: Array<{ field: string; msg: string }> = allErrors
      .filter((e): e is { field: string; msg: string } => e.field !== undefined && e.msg !== undefined)
      .map(({ field, msg }) => ({ field, msg }));
    if (outputErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: outputErrors,
      });
    }
    next();
  };
};
