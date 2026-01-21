const request = require('supertest');
const app = require('../src/server');
const path = require('path');
const fs = require('fs');

let adminToken;

beforeAll(async () => {
  // Connexion admin pour récupérer le token
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@smartcafe.fr', password: 'admin123' });
  adminToken = res.body.data.token;
  console.log('TOKEN:', adminToken); // Ajout du log pour debug
});

describe('Product Routes', () => {
  it('GET /api/products should return 200 and an array', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/products should create a product with image and serve the image', async () => {
    // Préparer une image de test
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    // Créer une image factice si elle n'existe pas
    if (!fs.existsSync(testImagePath)) {
      fs.writeFileSync(testImagePath, Buffer.from([0xff, 0xd8, 0xff, 0xd9])); // JPEG minimal
    }

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('name', 'Produit Test Image')
      .field('price', 9.99)
      .field('categoryId', 1)
      .attach('image', testImagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('image_url');
    const imageUrl = res.body.data.image_url;
    expect(imageUrl).toMatch(/\/uploads\//);

    // Vérifier que l'image est servie
    const imageRes = await request(app).get(imageUrl);
    expect(imageRes.statusCode).toBe(200);
    expect(imageRes.headers['content-type']).toMatch(/image/);
  });
});
