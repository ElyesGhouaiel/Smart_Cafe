const request = require('supertest');
const app = require('../src/server');

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const uniqueEmail = `test_${Date.now()}@example.com`;
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Inscription réussie');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
          firstName: '',
          lastName: ''
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });
});