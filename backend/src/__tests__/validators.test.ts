import {
  validateRequest,
  productValidators,
  categoryValidators,
  cartItemValidator,
  emailValidator,
  productQueryValidator,
} from '../middleware/validators';
import type { Request } from 'express';

/**
 * Build a fake req with a body object and query object attached to the given keys.
 */
function buildReq(body: Record<string, any> = {}, query: Record<string, any> = {}) {
  return { body, query } as unknown as Request;
}

interface MockResponse {
  statusCode: number;
  body: any;
  status(code: number): MockResponse;
  json(data: any): MockResponse;
}

function buildRes(): MockResponse {
  const res: MockResponse = {
    statusCode: 200,
    body: null,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(data: any) {
      res.body = data;
      return res;
    },
  };
  return res;
}

/**
 * Run validators and extract the result.
 * @param validations  express-validator chain(s)
 * @param body           request body (merged with req.query)
 * @param query          request query params
 */
function callValidator(
  validations: any[],
  body: Record<string, any> = {},
  query: Record<string, any> = {}
) {
  const req = buildReq(body, query);
  const res = buildRes();
  const next: jest.MockedFunction<import('express').NextFunction> = jest.fn();
  const middleware = validateRequest(validations);
  return Promise.resolve(middleware(req as any, res as any, next)).then(() => ({ next, res }));
}

describe('validateRequest middleware', () => {
  it('returns 400 JSON when email validator fails', async () => {
    const { next, res } = await callValidator(
      emailValidator,
      { email: 'not-an-email!!', password: 'whatever' }
    );
    expect(res.statusCode).toBe(400);
    expect((res.body as any).success).toBe(false);
    expect(Array.isArray((res.body as any).errors)).toBe(true);
    expect((res.body as any).errors[0].field).toBe('email');
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when all rules pass', async () => {
    const { next, res } = await callValidator(
      emailValidator,
      { email: 'good@example.com', password: 'secret123' }
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeNull();
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('productValidators', () => {
  it('rejects product with bad price', async () => {
    const { next, res } = await callValidator(productValidators, {
      name: 'Widget',
      price: -5,
      description: '',
      slug: 'widget',
    });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects product with uppercase slug', async () => {
    const { next, res } = await callValidator(productValidators, {
      name: 'Widget',
      price: 10,
      description: '',
      slug: 'Widget-1',
    });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects product with too-long name', async () => {
    const { next, res } = await callValidator(productValidators, {
      name: 'x'.repeat(201),
      price: 10,
      description: '',
      slug: 'widget',
    });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts valid product payload', async () => {
    const { next, res } = await callValidator(productValidators, {
      name: 'Widget',
      price: 99.5,
      description: 'nice',
      slug: 'widget-123',
    });
    expect(res.statusCode).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('categoryValidators', () => {
  it('rejects empty category name', async () => {
    const { next, res } = await callValidator(categoryValidators, { name: '' });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects category name longer than 100 chars', async () => {
    const { next, res } = await callValidator(categoryValidators, { name: 'x'.repeat(101) });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts short valid category name', async () => {
    const { next, res } = await callValidator(categoryValidators, { name: 'Electronics' });
    expect(res.statusCode).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('cartItemValidator', () => {
  it('rejects non-integer quantity', async () => {
    const { next, res } = await callValidator(cartItemValidator, {
      productId: 'p1',
      quantity: 1.5,
    });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects quantity over 999', async () => {
    const { next, res } = await callValidator(cartItemValidator, {
      productId: 'p1',
      quantity: 1000,
    });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts well-formed cart item', async () => {
    const { next, res } = await callValidator(cartItemValidator, {
      productId: 'p-1',
      quantity: 3,
    });
    expect(res.statusCode).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe('productQueryValidator', () => {
  it('rejects minPrice below zero', async () => {
    const { next, res } = await callValidator(productQueryValidator, {}, {
      minPrice: '-1',
      maxPrice: '10',
    });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects invalid sortBy option', async () => {
    const { next, res } = await callValidator(productQueryValidator, {}, {
      sortBy: 'random_sort',
    });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects overlong search term', async () => {
    const { next, res } = await callValidator(productQueryValidator, {}, {
      search: 'x'.repeat(201),
    });
    expect(res.statusCode).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts fully-valid query params', async () => {
    const { next, res } = await callValidator(
      productQueryValidator,
      {},
      { search: 'phone', minPrice: '10', maxPrice: '100', sortBy: 'price_asc' }
    );
    expect(res.statusCode).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
  });
});