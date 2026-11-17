import request from 'supertest';
import app from '../index';
import { categories } from '../config/database';

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

describe('Categories Routes (/api/categories)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: 'cat_001', name: 'Instagram', slug: 'instagram' },
        { id: 'cat_002', name: 'Spotify', slug: 'spotify' },
      ];
      (categories.getAll as jest.Mock).mockResolvedValue(mockCategories);

      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toEqual(mockCategories);
    });
  });

  describe('POST /api/categories', () => {
    it('should handle category creation', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Tech', slug: 'tech' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('created');
    });
  });
});

