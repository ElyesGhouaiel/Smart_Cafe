const request = require('supertest');
const app = require('../src/server');

describe('Order Routes', () => {
  it('GET /api/orders should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(401);
  });
});
