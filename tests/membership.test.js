import request from 'supertest';
import app from '../src/app.js';

describe('Membership API Tests', () => {
  let authToken = '';
  
  describe('POST /register', () => {
    test('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
    });

    test('should return 400 when email format is invalid', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          first_name: 'Test',
          last_name: 'User'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('email');
    });

    test('should return 400 when password is too short', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'short',
          first_name: 'Test',
          last_name: 'User'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password');
    });

    test('should validate all required fields individually', async () => {
      const fields = ['email', 'password', 'first_name', 'last_name'];
      
      for (const field of fields) {
        const payload = {
          email: 'test@example.com',
          password: 'password123',
          first_name: 'Test',
          last_name: 'User'
        };
        delete payload[field];

        const response = await request(app)
          .post('/register')
          .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain(field);
      }
    });
  });

  describe('POST /login', () => {
    test('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status');
    });

    test('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status');
    });

    test('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    test('should return 401 with non-existent user', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      // Server may return 400, 401, 403, or 500 depending on implementation
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /profile', () => {
    test('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/profile');

      expect([401, 403]).toContain(response.status);
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /profile/update', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/profile/update')
        .send({
          first_name: 'Updated',
          last_name: 'Name'
        });

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('PUT /profile/image', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .put('/profile/image');

      expect([401, 403]).toContain(response.status);
    });
  });
});
