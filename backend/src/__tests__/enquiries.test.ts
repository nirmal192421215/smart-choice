import request from 'supertest';
import app from '../index';

jest.mock('../config/database', () => ({
  products: { getAll: jest.fn(), getById: jest.fn() },
  categories: { getAll: jest.fn() },
  coupons: { validate: jest.fn() },
  orders: { getAll: jest.fn(), getById: jest.fn(), getByUserId: jest.fn(), create: jest.fn(), updateStatus: jest.fn() },
  orderItems: { createBulk: jest.fn() },
  enquiries: {
    create: jest.fn(),
    getAll: jest.fn(),
    updateStatus: jest.fn(),
  },
  payments: { create: jest.fn(), getByOrderId: jest.fn() },
  profiles: { getById: jest.fn(), getByEmail: jest.fn(), create: jest.fn(), update: jest.fn() },
}));

// GREEN-API must not actually hit the network during tests.
jest.mock('../services/greenapi', () => ({
  sendWhatsAppMessage: jest.fn().mockResolvedValue({ idMessage: 'mock' }),
  buildOrderNotification: jest.fn().mockReturnValue('mock message'),
}));

describe('POST /api/enquiries (validation + persistence)', () => {
  let enquiries: any;
  let sendWhatsAppMessage: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const db = require('../config/database');
    enquiries = db.enquiries;
    const ga = require('../services/greenapi');
    sendWhatsAppMessage = ga.sendWhatsAppMessage;
  });

  it('creates an enquiry with valid fields', async () => {
    enquiries.create.mockResolvedValue({
      id: 'e1',
      name: 'Ravi',
      phone: '9876543210',
      status: 'New',
    });

    const res = await request(app).post('/api/enquiries').send({
      name: 'Ravi',
      phone: '9876543210',
      email: 'ravi@example.com',
      city: 'Chennai',
      budget: '₹1,000 – ₹2,500',
      service: 'NFC Keychains (personal)',
      message: 'Looking for 100 keychains for a wedding',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('e1');
    expect(enquiries.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ravi',
        phone: '9876543210',
        email: 'ravi@example.com',
        city: 'Chennai',
        budget: '₹1,000 – ₹2,500',
        service: 'NFC Keychains (personal)',
        message: 'Looking for 100 keychains for a wedding',
        status: 'New',
      })
    );
    expect(sendWhatsAppMessage).toHaveBeenCalledTimes(1);
    expect(sendWhatsAppMessage.mock.calls[0][0]).toContain('Ravi');
    expect(sendWhatsAppMessage.mock.calls[0][0]).toContain('9876543210');
  });

  it('rejects missing name', async () => {
    const res = await request(app).post('/api/enquiries').send({ phone: '9876543210' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some((e: any) => e.field === 'name')).toBe(true);
  });

  it('rejects short phone number', async () => {
    const res = await request(app).post('/api/enquiries').send({ name: 'Ravi', phone: '123' });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'phone')).toBe(true);
  });

  it('rejects invalid email format', async () => {
    const res = await request(app).post('/api/enquiries').send({
      name: 'Ravi',
      phone: '9876543210',
      email: 'not-an-email',
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'email')).toBe(true);
  });

  it('rejects too-long message', async () => {
    const res = await request(app).post('/api/enquiries').send({
      name: 'Ravi',
      phone: '9876543210',
      message: 'x'.repeat(2001),
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === 'message')).toBe(true);
  });

  it('accepts minimal payload (name + phone only)', async () => {
    enquiries.create.mockResolvedValue({ id: 'e2', name: 'Ravi', phone: '9876543210' });

    const res = await request(app).post('/api/enquiries').send({
      name: 'Ravi',
      phone: '9876543210',
    });

    expect(res.status).toBe(201);
    expect(enquiries.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ravi',
        phone: '9876543210',
        email: null,
        city: null,
        budget: null,
        service: null,
        message: null,
        status: 'New',
      })
    );
  });

  it('still returns 201 when WhatsApp notification fails', async () => {
    enquiries.create.mockResolvedValue({ id: 'e3', name: 'ravi', phone: '9876543210' });
    sendWhatsAppMessage.mockRejectedValueOnce(new Error('network down'));

    const res = await request(app).post('/api/enquiries').send({
      name: 'Ravi',
      phone: '9876543210',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(sendWhatsAppMessage).toHaveBeenCalledTimes(1);
  });
});