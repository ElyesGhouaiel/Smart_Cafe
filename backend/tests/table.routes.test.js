const request = require('supertest');
const app = require('../src/server');

describe('Table Routes', () => {
  it('GET /api/tables should return 200 and an array', async () => {
    const res = await request(app).get('/api/tables');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
