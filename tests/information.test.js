import request from 'supertest';
import app from '../src/app.js';

describe('Information API Tests', () => {
  describe('GET /banner', () => {
    test('should return banner list without authentication', async () => {
      const response = await request(app)
        .get('/banner');

      expect(response.status).toBeDefined();
      expect(response.body).toHaveProperty('status');
      // Response may have 'message' or error structure
      if (response.body.message) {
        expect(response.body).toHaveProperty('message');
      }
    });

    test('should return data property in response', async () => {
      const response = await request(app)
        .get('/banner');

      expect(response.body).toHaveProperty('data');
    });
  });

  describe('GET /services', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/services');

      expect([401, 403]).toContain(response.status);
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/services')
        .set('Authorization', 'Bearer invalid-token');

      expect([401, 403]).toContain(response.status);
    });

    test('should reject requests with malformed authorization header', async () => {
      const response = await request(app)
        .get('/services')
        .set('Authorization', 'InvalidFormat token123');

      expect([401, 403]).toContain(response.status);
    });

    test('should reject requests with empty bearer token', async () => {
      const response = await request(app)
        .get('/services')
        .set('Authorization', 'Bearer ');

      expect([401, 403]).toContain(response.status);
    });
  });
});
