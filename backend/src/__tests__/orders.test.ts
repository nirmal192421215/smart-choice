import request from 'supertest';
import app from '../index';
import { orders } from '../config/database';

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
    getById: jest.fn(),
    getByUserId: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
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

describe('Orders Routes (/api/orders)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/orders/:id', () => {
    it('should return 404 if order is not found', async () => {
      (orders.getById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/orders/nonexistent_id');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Order not found');
    });

    it('should return order if found', async () => {
      const mockOrder = { id: 'ord_123', total_amount: 599, status: 'Confirmed' };
      (orders.getById as jest.Mock).mockResolvedValue(mockOrder);

      const res = await request(app).get('/api/orders/ord_123');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('ord_123');
    });
  });

  describe('POST /api/orders', () => {
    it('should return 400 when missing items or shippingAddress', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ totalAmount: 499 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Missing required order fields');
    });

    it('should create order when valid payload is passed', async () => {
      const orderPayload = {
        items: [{ productId: 'prod_001', quantity: 1, price: 350 }],
        shippingAddress: {
          fullName: 'Test User',
          phone: '9876543210',
          addressLine1: 'Test St',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
        },
        totalAmount: 350,
        paymentMethod: 'cod',
      };

      (orders.create as jest.Mock).mockResolvedValue({
        id: 'ord_999',
        ...orderPayload,
      });

      const res = await request(app)
        .post('/api/orders')
        .send(orderPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('ord_999');
      expect(res.body.data.orderNumber).toBeDefined();
    });
  });

  describe('GET /api/orders/my-orders', () => {
    it('should return 401 unauthorized when auth token is missing', async () => {
      const res = await request(app).get('/api/orders/my-orders');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});

