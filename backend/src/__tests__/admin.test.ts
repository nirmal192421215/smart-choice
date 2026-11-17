import request from 'supertest';
import app from '../index';
import { orders, products, enquiries } from '../config/database';

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
    updateStatus: jest.fn(),
  },
  orderItems: {
    createBulk: jest.fn(),
  },
  enquiries: {
    getAll: jest.fn(),
    updateStatus: jest.fn(),
  },
  payments: {
    create: jest.fn(),
  },
}));

describe('Admin Routes (/api/admin)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/stats', () => {
    it('should return aggregated store metrics and statistics', async () => {
      (orders.getAll as jest.Mock).mockResolvedValue([
        { id: '1', total_amount: 350, status: 'Confirmed' },
        { id: '2', total_amount: 299, status: 'Delivered' },
      ]);
      (products.getAll as jest.Mock).mockResolvedValue([
        { id: 'p1' }, { id: 'p2' }, { id: 'p3' },
      ]);
      (enquiries.getAll as jest.Mock).mockResolvedValue([
        { id: 'e1', message: 'Hello' },
      ]);

      const res = await request(app).get('/api/admin/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalRevenue).toBe(649);
      expect(res.body.data.totalOrders).toBe(2);
      expect(res.body.data.totalProducts).toBe(3);
      expect(res.body.data.pendingOrders).toBe(1);
    });
  });

  describe('GET /api/admin/orders', () => {
    it('should return list of all orders', async () => {
      const mockOrders = [{ id: 'ord_1', total_amount: 350 }];
      (orders.getAll as jest.Mock).mockResolvedValue(mockOrders);

      const res = await request(app).get('/api/admin/orders');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data).toEqual(mockOrders);
    });
  });

  describe('PATCH /api/admin/orders/:id/status', () => {
    it('should update order status', async () => {
      const updatedOrder = { id: 'ord_1', status: 'Shipped', payment_status: 'captured' };
      (orders.updateStatus as jest.Mock).mockResolvedValue(updatedOrder);

      const res = await request(app)
        .patch('/api/admin/orders/ord_1/status')
        .send({ status: 'Shipped', paymentStatus: 'captured' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Shipped');
    });
  });

  describe('GET /api/admin/enquiries', () => {
    it('should return all enquiries', async () => {
      const mockEnquiries = [{ id: 'enq_1', email: 'test@example.com' }];
      (enquiries.getAll as jest.Mock).mockResolvedValue(mockEnquiries);

      const res = await request(app).get('/api/admin/enquiries');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });
});

