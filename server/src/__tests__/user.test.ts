import request from 'supertest';
import app from '../server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';

jest.mock('../config/database', () => ({
  connectDatabase: jest.fn().mockResolvedValue(undefined),
}));

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

jest.mock('../models/User', () => ({
  findOne: jest.fn().mockResolvedValue(null),
  findById: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
  findByIdAndUpdate: jest.fn().mockResolvedValue(mockUser),
  findByIdAndDelete: jest.fn().mockResolvedValue(mockUser),
}));

const authToken = jwt.sign({ id: 'user-id-123', email: 'test@example.com', role: 'student' }, JWT_SECRET, { expiresIn: '1h' });

describe('User Endpoints', () => {
  describe('GET /api/user/profile', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).get('/api/user/profile');
      expect(res.status).toBe(401);
    });

    it('should return user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('username');
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should return 401 without auth token', async () => {
      const res = await request(app).put('/api/user/profile').send({ username: 'newname' });
      expect(res.status).toBe(401);
    });

    it('should return 400 for invalid username', async () => {
      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'a' });
      expect(res.status).toBe(400);
    });

    it('should update profile with valid data', async () => {
      const res = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ bio: 'My bio' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('PUT /api/user/change-password', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).put('/api/user/change-password').send({});
      expect(res.status).toBe(401);
    });

    it('should return 400 if fields missing', async () => {
      const res = await request(app)
        .put('/api/user/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/user/account', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).delete('/api/user/account');
      expect(res.status).toBe(401);
    });

    it('should delete account with valid auth', async () => {
      const res = await request(app)
        .delete('/api/user/account')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
