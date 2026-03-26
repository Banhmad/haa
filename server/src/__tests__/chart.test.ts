import request from 'supertest';
import app from '../server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';

jest.mock('../config/database', () => ({
  connectDatabase: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../models/Chart', () => ({
  find: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }),
  create: jest.fn().mockResolvedValue({ id: 'chart-id-1', symbol: 'AAPL', interval: '1d' }),
}));

jest.mock('../services/apiService', () => ({
  getStockData: jest.fn().mockResolvedValue({ 'Global Quote': {} }),
  getCryptoPrice: jest.fn().mockResolvedValue({ bitcoin: { usd: 40000, usd_24h_change: 1.5 } }),
}));

const authToken = jwt.sign({ id: 'user-id-123', email: 'test@example.com', role: 'student' }, JWT_SECRET, { expiresIn: '1h' });

describe('Chart Endpoints', () => {
  describe('GET /api/chart/quote/:symbol', () => {
    it('should return quote data for valid symbol', async () => {
      const res = await request(app).get('/api/chart/quote/AAPL');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('symbol');
    });
  });

  describe('GET /api/chart/history/:symbol', () => {
    it('should return history data', async () => {
      const res = await request(app).get('/api/chart/history/AAPL?limit=10');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/chart/search', () => {
    it('should return 400 if query is missing', async () => {
      const res = await request(app).get('/api/chart/search');
      expect(res.status).toBe(400);
    });

    it('should return search results', async () => {
      const res = await request(app).get('/api/chart/search?q=AAPL');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/chart/crypto/:coinId', () => {
    it('should return crypto price data', async () => {
      const res = await request(app).get('/api/chart/crypto/bitcoin');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/chart/save', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).post('/api/chart/save').send({ symbol: 'AAPL', interval: '1d', chartType: 'candlestick' });
      expect(res.status).toBe(401);
    });

    it('should save chart with valid auth', async () => {
      const res = await request(app)
        .post('/api/chart/save')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ symbol: 'AAPL', interval: '1d', chartType: 'candlestick' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/chart/my-charts', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/chart/my-charts');
      expect(res.status).toBe(401);
    });

    it('should return charts with valid auth', async () => {
      const res = await request(app)
        .get('/api/chart/my-charts')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
