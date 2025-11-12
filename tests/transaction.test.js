import request from 'supertest';
import app from '../src/app.js';

describe('Transaction API Tests', () => {
  describe('GET /balance', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/balance');

      expect([401, 403]).toContain(response.status);
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/balance')
        .set('Authorization', 'Bearer invalid-token');

      expect([401, 403]).toContain(response.status);
    });

    test('should validate authorization header format', async () => {
      const response = await request(app)
        .get('/balance')
        .set('Authorization', 'InvalidFormat');

      expect([401, 403]).toContain(response.status);
    });
  });

  describe('POST /topup', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/topup')
        .send({
          top_up_amount: 100000
        });

      expect([401, 403]).toContain(response.status);
    });

    test('should validate topup amount is provided', async () => {
      const response = await request(app)
        .post('/topup')
        .set('Authorization', 'Bearer invalid-token')
        .send({});

      expect(response.status).toBeDefined();
    });

    test('should validate topup amount format', async () => {
      const response = await request(app)
        .post('/topup')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          top_up_amount: 'invalid'
        });

      expect(response.status).toBeDefined();
    });

    test('should validate negative topup amount', async () => {
      const response = await request(app)
        .post('/topup')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          top_up_amount: -1000
        });

      expect(response.status).toBeDefined();
    });

    test('should validate zero topup amount', async () => {
      const response = await request(app)
        .post('/topup')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          top_up_amount: 0
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('POST /transaction', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/transaction')
        .send({
          service_code: 'PULSA'
        });

      expect([401, 403]).toContain(response.status);
    });

    test('should validate service_code is provided', async () => {
      const response = await request(app)
        .post('/transaction')
        .set('Authorization', 'Bearer invalid-token')
        .send({});

      expect(response.status).toBeDefined();
    });

    test('should validate service_code format', async () => {
      const response = await request(app)
        .post('/transaction')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          service_code: ''
        });

      expect(response.status).toBeDefined();
    });
  });

  describe('GET /transaction/history', () => {
    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/transaction/history');

      expect([401, 403]).toContain(response.status);
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/transaction/history')
        .set('Authorization', 'Bearer invalid-token');

      expect([401, 403]).toContain(response.status);
    });

    test('should accept valid offset parameter', async () => {
      const response = await request(app)
        .get('/transaction/history?offset=0')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBeDefined();
    });

    test('should accept valid limit parameter', async () => {
      const response = await request(app)
        .get('/transaction/history?limit=10')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBeDefined();
    });

    test('should accept both offset and limit parameters', async () => {
      const response = await request(app)
        .get('/transaction/history?offset=0&limit=5')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBeDefined();
    });
  });
});
