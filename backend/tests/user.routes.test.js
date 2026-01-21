const request = require('supertest');
const app = require('../src/server');

describe('User Routes', () => {
  it('GET /api/users/me should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.statusCode).toBe(401);
  });
});
