import request from 'supertest';
import app from '../index';

describe('Middleware & Error Handling', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-endpoint-12345');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Not Found');
  });

  it('should handle CORS headers properly', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:5173');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });
});

