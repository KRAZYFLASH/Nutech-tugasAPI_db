import jwt from 'jsonwebtoken';
import { generateToken } from '../src/middlewares/auth.js';

// Mock environment variable
process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Tests', () => {
  describe('generateToken', () => {
    test('should generate a valid JWT token', () => {
      const email = 'test@example.com';
      const token = generateToken(email);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should generate token with correct payload', () => {
      const email = 'test@example.com';
      const token = generateToken(email);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.email).toBe(email);
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');
    });

    test('should generate different tokens for different emails', () => {
      const token1 = generateToken('user1@example.com');
      const token2 = generateToken('user2@example.com');

      expect(token1).not.toBe(token2);
    });

    test('token should be verifiable', () => {
      const email = 'verify@example.com';
      const token = generateToken(email);

      expect(() => {
        jwt.verify(token, process.env.JWT_SECRET);
      }).not.toThrow();
    });

    test('token should expire in 12 hours', () => {
      const email = 'expire@example.com';
      const token = generateToken(email);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const expiryTime = decoded.exp - decoded.iat;
      expect(expiryTime).toBe(12 * 60 * 60); // 12 hours in seconds
    });
  });
});
