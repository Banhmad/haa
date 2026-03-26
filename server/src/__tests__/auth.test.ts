import request from 'supertest';
import app from '../server';

jest.mock('../config/database', () => ({
  connectDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../models/User', () => {
  const mockUser = {
    id: 'user-id-123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'student',
    isEmailVerified: false,
    avatar: undefined,
    bio: undefined,
    createdAt: new Date(),
    comparePassword: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  };
  const MockModel = {
    findOne: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
  };
  return MockModel;
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password1',
      });
      expect(res.status).toBe(400);
    });

    it('should return 400 for weak password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
      });
      expect(res.status).toBe(400);
    });

    it('should return 201 for valid registration', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password1',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'not-an-email',
        password: 'Password1',
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({});
      expect(res.status).toBe(400);
    });

    it('should return 200 even if user not found (no email enumeration)', async () => {
      const User = require('../models/User');
      User.findOne.mockResolvedValueOnce(null);
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'noone@example.com' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should return 400 if token or newPassword is missing', async () => {
      const res = await request(app).post('/api/auth/reset-password').send({});
      expect(res.status).toBe(400);
    });

    it('should return 400 for weak new password', async () => {
      const res = await request(app).post('/api/auth/reset-password').send({
        token: 'sometoken',
        newPassword: 'weak',
      });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/health', () => {
    it('should return ok status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown-route-xyz');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
