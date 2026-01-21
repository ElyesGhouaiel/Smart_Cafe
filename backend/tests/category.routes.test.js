const request = require('supertest');
const app = require('../src/server');

describe('Category Routes', () => {
  it('GET /api/categories should return 200 and an array', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
