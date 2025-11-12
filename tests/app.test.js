import request from 'supertest';
import app from '../src/app.js';

describe('API Health Check', () => {
  test('GET / should return success message', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /text/)
      .expect(200);

    expect(response.text).toBe('Muhammad Fakhri-Tugas API is running');
  });
});
