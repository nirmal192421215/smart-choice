import request from 'supertest';
import app from '../index';

describe('Auth Routes (/api/auth)', () => {
  describe('POST /api/auth/signin', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e: any) => e.field === 'password')).toBe(true);
    });

    it('should return 400 if credentials are empty', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e: any) => e.field === 'email')).toBe(true);
      expect(res.body.errors.some((e: any) => e.field === 'password')).toBe(true);
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should return 400 if email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.some((e: any) => e.field === 'password')).toBe(true);
    });
  });
});