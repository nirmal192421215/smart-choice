import request from 'supertest';
import app from '../index';

describe('Payments Routes (/api/payments)', () => {
  const originalSecret = process.env.RAZORPAY_KEY_SECRET;

  afterEach(() => {
    process.env.RAZORPAY_KEY_SECRET = originalSecret;
  });

  describe('POST /api/payments/create-order', () => {
    it('should return 400 if amount is missing', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Amount is required');
    });

    it('should create simulated payment order if keys not configured', async () => {
      const res = await request(app)
        .post('/api/payments/create-order')
        .send({ amount: 500 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(50000); // 500 * 100 paise
      expect(res.body.data.currency).toBe('INR');
      expect(res.body.data.id).toBeDefined();
    });
  });

  describe('POST /api/payments/verify', () => {
    it('should return 400 if payment signature is invalid', async () => {
      process.env.RAZORPAY_KEY_SECRET = 'test_secret_for_validation';

      const res = await request(app)
        .post('/api/payments/verify')
        .send({
          razorpayOrderId: 'order_123',
          razorpayPaymentId: 'pay_123',
          razorpaySignature: 'invalid_signature_hex',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid payment signature');
    });

    it('should verify payment successfully in simulation mode', async () => {
      delete process.env.RAZORPAY_KEY_SECRET;

      const res = await request(app)
        .post('/api/payments/verify')
        .send({
          amount: 500,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Payment verified successfully');
    });
  });
});
