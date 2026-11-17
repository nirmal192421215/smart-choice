/**
 * Integration tests for the validation middleware via the real Express app.
 *
 * These tests use supertest to hit real routes so we confirm that validation
 * rejects bad input with a 400 response that includes field-level errors.
 * We only test the "rejects invalid" cases to avoid DB mocking complexity.
 */
import request from 'supertest';

// Mock the Supabase client so valid payloads don't reach a real DB
jest.mock('../config/supabase', () => {
  const chainable = {
    select: () => chainable,
    insert: () => chainable,
    update: () => chainable,
    delete: () => chainable,
    eq: () => chainable,
    order: () => chainable,
    single: () => Promise.resolve({ data: { id: 'prod-1', name: 'Widget', slug: 'widget', price: 10 }, error: null }),
    // list-shaped calls
    then: (resolve: any, reject: any) =>
      Promise.resolve({
        data: [{ id: 'prod-1', name: 'Widget', slug: 'widget', price: 10, category: 'Cat', created_at: new Date().toISOString() }],
        error: null,
      }).then(resolve, reject),
  };
  const from = jest.fn(() => chainable);
  const mockClient = {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { session: { access_token: 'tok' }, user: { id: 'u1', email: 'x@example.com' } },
        error: null,
      }),
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'u2', email: 'y@example.com' } }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      getSession: jest.fn().mockResolvedValue({ data: { session: { access_token: 'tok' } }, error: null }),
    },
  };
  return {
    supabase: { auth: mockClient.auth, from },
    supabaseAdmin: { auth: mockClient.auth, from },
  };
});

describe('POST /api/products (validation)', () => {
  let app: import('express').Express;

  beforeAll(async () => {
    app = (await import('../index')).default;
  });

  const badBodies = [
    { name: '', price: 10, description: '', slug: 'widget' }, // empty name
    { name: 'Widget', price: -1, description: '', slug: 'widget' }, // negative price
    { name: 'Widget', price: 10, description: '', slug: 'Widget' }, // bad slug
    { name: 'x'.repeat(201), price: 10, description: '', slug: 'slug' }, // too-long name
  ];

  badBodies.forEach((body) => {
    it(`rejects ${JSON.stringify(body)} with 400 + errors`, async () => {
      const res = await request(app)
        .post('/api/products')
        .set('X-CSRF-Token', 'test')
        .send(body);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThanOrEqual(1);
      expect(res.body.errors[0]).toHaveProperty('field');
      expect(res.body.errors[0]).toHaveProperty('msg');
    });
  });
});

describe('PUT /api/products/:id (validation)', () => {
  let app: import('express').Express;
  beforeAll(async () => {
    app = (await import('../index')).default;
  });

  it('rejects bad price on PUT', async () => {
    const res = await request(app)
      .put('/api/products/prod-1')
      .set('X-CSRF-Token', 'test')
      .send({ name: 'Widget', price: -5, description: '', slug: 'slug' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0]).toHaveProperty('field');
  });
});

describe('GET /api/products (query validation)', () => {
  let app: import('express').Express;
  beforeAll(async () => {
    app = (await import('../index')).default;
  });

  it('rejects invalid sortBy', async () => {
    const res = await request(app)
      .get('/api/products')
      .query({ sortBy: 'bogus_sort' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('sortBy');
  });

  it('rejects negative minPrice', async () => {
    const res = await request(app)
      .get('/api/products')
      .query({ minPrice: '-1' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'minPrice')).toBe(true);
  });

  it('rejects overlong search term', async () => {
    const res = await request(app)
      .get('/api/products')
      .query({ search: 'x'.repeat(201) });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'search')).toBe(true);
  });
});

describe('POST /api/categories (validation)', () => {
  let app: import('express').Express;
  beforeAll(async () => {
    app = (await import('../index')).default;
  });

  it('rejects empty category name', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('X-CSRF-Token', 'test')
      .send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe('name');
  });

  it('rejects category name > 100 chars', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('X-CSRF-Token', 'test')
      .send({ name: 'x'.repeat(101) });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/signin (email validation)', () => {
  let app: import('express').Express;
  beforeAll(async () => {
    app = (await import('../index')).default;
  });

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .set('X-CSRF-Token', 'test')
      .send({ email: 'not-an-email', password: 'secret' });
    expect(res.status).toBe(400);
    expect(res.body.errors[0].field).toBe('email');
  });
});

describe('POST /api/cart/validate (cart item validation)', () => {
  let app: import('express').Express;
  beforeAll(async () => {
    app = (await import('../index')).default;
  });

  it('rejects non-integer quantity', async () => {
    const res = await request(app)
      .post('/api/cart/validate')
      .set('X-CSRF-Token', 'test')
      .send({ items: [{ productId: 'p1', quantity: 1.5 }] });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some((e: any) => e.field && e.field.includes('quantity'))).toBe(true);
  });

  it('rejects quantity over 999', async () => {
    const res = await request(app)
      .post('/api/cart/validate')
      .set('X-CSRF-Token', 'test')
      .send({ items: [{ productId: 'p1', quantity: 1000 }] });
    expect(res.status).toBe(400);
  });

  it('rejects bad productId pattern', async () => {
    const res = await request(app)
      .post('/api/cart/validate')
      .set('X-CSRF-Token', 'test')
      .send({ items: [{ productId: 'p@#', quantity: 3 }] });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some((e: any) => e.field && e.field.includes('productId'))).toBe(true);
  });
});