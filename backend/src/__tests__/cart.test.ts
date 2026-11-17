import request from 'supertest';
import app from '../index';
import { coupons } from '../config/database';

jest.mock('../config/database', () => ({
  products: {
    getAll: jest.fn(),
  },
  categories: {
    getAll: jest.fn(),
  },
  coupons: {
    validate: jest.fn(),
  },
  orders: {
    getAll: jest.fn(),
  },
  orderItems: {
    createBulk: jest.fn(),
  },
  enquiries: {
    getAll: jest.fn(),
  },
  payments: {
    create: jest.fn(),
  },
}));

describe('Cart Routes (/api/cart)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/cart/validate', () => {
    it('should calculate cart subtotal and shipping charges for orders under 1000', async () => {
      const items = [{ productId: 'p1', price: 350, quantity: 2 }];

      const res = await request(app)
        .post('/api/cart/validate')
        .send({ items });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subtotal).toBe(700);
      expect(res.body.data.shippingCharges).toBe(99);
      expect(res.body.data.totalAmount).toBe(799);
    });

    it('should provide free shipping on orders of 1000 or more', async () => {
      const items = [{ productId: 'p2', price: 500, quantity: 2 }];

      const res = await request(app)
        .post('/api/cart/validate')
        .send({ items });

      expect(res.status).toBe(200);
      expect(res.body.data.subtotal).toBe(1000);
      expect(res.body.data.shippingCharges).toBe(0);
      expect(res.body.data.totalAmount).toBe(1000);
    });

    it('should apply valid percentage discount coupon', async () => {
      (coupons.validate as jest.Mock).mockResolvedValue({
        valid: true,
        coupon: {
          code: 'DISCOUNT10',
          discountType: 'percentage',
          discountValue: 10,
        },
      });

      const items = [{ productId: 'p3', price: 1000, quantity: 1 }];

      const res = await request(app)
        .post('/api/cart/validate')
        .send({ items, couponCode: 'DISCOUNT10' });

      expect(res.status).toBe(200);
      expect(res.body.data.discount).toBe(100);
      expect(res.body.data.couponApplied).toBe(true);
      expect(res.body.data.totalAmount).toBe(900);
    });

    it('should return 400 if items array is missing', async () => {
      const res = await request(app)
        .post('/api/cart/validate')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e: any) => e.field === 'items')).toBe(true);
    });
  });

  describe('POST /api/cart/apply-coupon', () => {
    it('should return 400 if coupon code is missing', async () => {
      const res = await request(app)
        .post('/api/cart/apply-coupon')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Coupon code is required');
    });

    it('should return 400 if coupon code is invalid or expired', async () => {
      (coupons.validate as jest.Mock).mockResolvedValue({
        valid: false,
        reason: 'Coupon expired',
      });

      const res = await request(app)
        .post('/api/cart/apply-coupon')
        .send({ code: 'EXPIRED10' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Coupon expired');
    });
  });
});

