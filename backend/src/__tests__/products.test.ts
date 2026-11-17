import request from 'supertest';
import app from '../index';
import { products } from '../config/database';

jest.mock('../config/database', () => ({
  products: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getBySlug: jest.fn(),
    getByCategory: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
    getByOrderId: jest.fn(),
  },
}));

const getMockProducts = () => [
  {
    id: 'prod_001',
    slug: 'spotify-nfc-keychain',
    name: 'Spotify NFC Keychain',
    description: 'Instantly share your favorite track or album',
    price: 350,
    category: 'Spotify',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prod_002',
    slug: 'instagram-nfc-keychain',
    name: 'Instagram NFC Keychain',
    description: 'Share your Instagram handle with a tap',
    price: 299,
    category: 'Instagram',
    created_at: '2026-01-02T00:00:00Z',
  },
];

describe('Products Routes (/api/products)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      (products.getAll as jest.Mock).mockResolvedValue(getMockProducts());

      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
    });

    it('should filter products by category', async () => {
      (products.getAll as jest.Mock).mockResolvedValue(getMockProducts());

      const res = await request(app).get('/api/products?category=Spotify');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].category).toBe('Spotify');
    });

    it('should search products by keyword', async () => {
      (products.getAll as jest.Mock).mockResolvedValue(getMockProducts());

      const res = await request(app).get('/api/products?search=instagram');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toContain('Instagram');
    });

    it('should filter products by price range', async () => {
      (products.getAll as jest.Mock).mockResolvedValue(getMockProducts());

      const res = await request(app).get('/api/products?minPrice=300&maxPrice=400');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].price).toBe(350);
    });

    it('should sort products by price ascending', async () => {
      (products.getAll as jest.Mock).mockResolvedValue(getMockProducts());

      const res = await request(app).get('/api/products?sortBy=price_asc');
      expect(res.status).toBe(200);
      expect(res.body.data[0].price).toBe(299);
      expect(res.body.data[1].price).toBe(350);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product by ID', async () => {
      (products.getById as jest.Mock).mockResolvedValue(getMockProducts()[0]);

      const res = await request(app).get('/api/products/prod_001');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('prod_001');
    });

    it('should return 404 if product ID is not found', async () => {
      (products.getById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/products/unknown_id');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Product not found');
    });
  });

  describe('GET /api/products/slug/:slug', () => {
    it('should return product by slug', async () => {
      (products.getBySlug as jest.Mock).mockResolvedValue(getMockProducts()[0]);

      const res = await request(app).get('/api/products/slug/spotify-nfc-keychain');
      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe('spotify-nfc-keychain');
    });

    it('should return 404 if slug is not found', async () => {
      (products.getBySlug as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/products/slug/nonexistent-slug');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });
  });

  describe('GET /api/products/category/:category', () => {
    it('should return products by category', async () => {
      (products.getByCategory as jest.Mock).mockResolvedValue([getMockProducts()[0]]);

      const res = await request(app).get('/api/products/category/Spotify');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].category).toBe('Spotify');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProd = {
        name: 'New Tag',
        price: 199,
        category: 'Tech',
        description: 'A tag',
        slug: 'new-tag',
      };
      (products.create as jest.Mock).mockResolvedValue({ id: 'prod_999', ...newProd });

      const res = await request(app).post('/api/products').send(newProd);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('prod_999');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      (products.update as jest.Mock).mockResolvedValue({ ...getMockProducts()[0], price: 399 });

      const res = await request(app)
        .put('/api/products/prod_001')
        .send({ name: 'Spotify NFC Keychain', price: 399, description: 'Instantly share your favorite track or album', slug: 'spotify-nfc-keychain' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(399);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      (products.delete as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete('/api/products/prod_001');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Product deleted successfully');
    });
  });
});
