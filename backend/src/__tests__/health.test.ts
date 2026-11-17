import request from 'supertest';
import app from '../index';

describe('GET /health', () => {
  it('should return 200 and OK status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.service).toBe('Smart Choice API');
  });
});

