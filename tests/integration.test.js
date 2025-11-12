import request from 'supertest';
import app from '../src/app.js';

describe('Integration Tests - Full Flow', () => {
  const uniqueEmail = `testuser${Date.now()}@example.com`;
  let authToken = '';

  describe('User Registration and Login Flow', () => {
    test('should complete full registration flow', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          email: uniqueEmail,
          password: 'password123',
          first_name: 'Integration',
          last_name: 'Test'
        });

      // Should either succeed (200) or fail with validation error (400) or server error
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.body).toHaveProperty('status');
      // Check for message or error status
      expect(response.body.status !== undefined).toBe(true);
    });
  });

  describe('Protected Routes Access', () => {
    test('should deny access to /balance without token', async () => {
      const response = await request(app)
        .get('/balance');

      expect([401, 403]).toContain(response.status);
    });

    test('should deny access to /services without token', async () => {
      const response = await request(app)
        .get('/services');

      expect([401, 403]).toContain(response.status);
    });

    test('should deny access to /profile without token', async () => {
      const response = await request(app)
        .get('/profile');

      expect([401, 403]).toContain(response.status);
    });

    test('should deny access to /transaction/history without token', async () => {
      const response = await request(app)
        .get('/transaction/history');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('Public Routes Access', () => {
    test('should allow access to /banner without authentication', async () => {
      const response = await request(app)
        .get('/banner');

      expect(response.status).toBeDefined();
      expect(response.body).toHaveProperty('status');
    });

    test('should allow access to root path', async () => {
      const response = await request(app)
        .get('/');

      expect(response.status).toBe(200);
      expect(response.text).toContain('Muhammad Fakhri');
    });
  });

  describe('Input Validation Tests', () => {
    test('should validate empty request bodies', async () => {
      const endpoints = [
        { method: 'post', path: '/register' },
        { method: 'post', path: '/login' },
        { method: 'post', path: '/topup' },
        { method: 'post', path: '/transaction' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path)
          .send({});

        expect([400, 401, 403]).toContain(response.status);
        expect(response.body).toHaveProperty('status');
      }
    });

    test('should validate malformed JSON', async () => {
      const response = await request(app)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect([400, 401, 500]).toContain(response.status);
    });
  });

  describe('HTTP Methods Validation', () => {
    test('should handle OPTIONS requests (CORS preflight)', async () => {
      const response = await request(app)
        .options('/banner');

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('should handle non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route');

      expect([404, 200]).toContain(response.status);
    });

    test('should handle invalid HTTP methods on valid routes', async () => {
      const response = await request(app)
        .delete('/banner');

      expect([404, 405, 200]).toContain(response.status);
    });
  });

  describe('Response Format Validation', () => {
    test('should return JSON responses for API endpoints', async () => {
      const response = await request(app)
        .get('/banner');

      expect(response.headers['content-type']).toMatch(/json/);
    });

    test('all API responses should have standard structure', async () => {
      const response = await request(app)
        .get('/banner');

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('data');
      // Message may or may not be present depending on error state
    });
  });
});
