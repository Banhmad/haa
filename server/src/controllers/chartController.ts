import { Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import Chart from '../models/Chart';
import cacheService from '../services/cacheService';
import * as apiService from '../services/apiService';

export const getQuote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { symbol } = req.params;
    if (!symbol) return next(createError('Symbol is required', 400));
    const sym = symbol.toUpperCase();
    const cacheKey = `quote:${sym}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }
    const raw = await apiService.getStockData(sym);
    const gq = (raw as any)['Global Quote'];
    const quote = gq
      ? {
          symbol: gq['01. symbol'] || sym,
          name: `${sym} Inc.`,
          price: parseFloat(gq['05. price'] || '0'),
          change: parseFloat(gq['09. change'] || '0'),
          changePercent: parseFloat((gq['10. change percent'] || '0%').replace('%', '')),
          volume: parseInt(gq['06. volume'] || '0', 10),
          timestamp: new Date().toISOString(),
        }
      : {
          symbol: sym,
          name: `${sym} Inc.`,
          price: parseFloat((100 + Math.random() * 400).toFixed(2)),
          change: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)),
          changePercent: parseFloat(((Math.random() - 0.5) * 3).toFixed(2)),
          volume: Math.floor(Math.random() * 10_000_000),
          timestamp: new Date().toISOString(),
        };
    cacheService.set(cacheKey, quote, 60);
    res.json({ success: true, data: quote });
  } catch (error) { next(error); }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { interval = '1d', limit = '100' } = req.query;
    if (!symbol) return next(createError('Symbol is required', 400));
    const sym = symbol.toUpperCase();
    const count = parseInt(limit as string, 10);
    const cacheKey = `history:${sym}:${interval}:${count}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }
    const history = Array.from({ length: count }, (_, i) => {
      const base = 150 + Math.random() * 50;
      const date = new Date();
      date.setDate(date.getDate() - (count - i));
      return {
        time: date.toISOString().split('T')[0],
        open: parseFloat((base + Math.random() * 5).toFixed(2)),
        high: parseFloat((base + Math.random() * 10).toFixed(2)),
        low: parseFloat((base - Math.random() * 10).toFixed(2)),
        close: parseFloat((base + Math.random() * 5).toFixed(2)),
        volume: Math.floor(Math.random() * 5_000_000),
      };
    });
    cacheService.set(cacheKey, history, 300);
    res.json({ success: true, data: history });
  } catch (error) { next(error); }
};

export const searchSymbol = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q) return next(createError('Query parameter is required', 400));
    const query = (q as string).toUpperCase();
    const cacheKey = `search:${query}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }
    const mockSymbols = ['AAPL', 'AMZN', 'GOOGL', 'META', 'MSFT', 'NVDA', 'TSLA'];
    const results = mockSymbols
      .filter((s) => s.includes(query))
      .map((symbol) => ({
        symbol,
        name: `${symbol} Inc.`,
        price: parseFloat((100 + Math.random() * 400).toFixed(2)),
        change: 0,
        changePercent: 0,
        volume: 0,
        timestamp: new Date().toISOString(),
      }));
    cacheService.set(cacheKey, results, 300);
    res.json({ success: true, data: results });
  } catch (error) { next(error); }
};

export const getCryptoPrice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { coinId } = req.params;
    if (!coinId) return next(createError('Coin ID is required', 400));
    const cacheKey = `crypto:${coinId}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached, cached: true });
      return;
    }
    const data = await apiService.getCryptoPrice(coinId);
    cacheService.set(cacheKey, data, 60);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

export const saveChart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chart = await Chart.create({ ...req.body, userId: req.user?.id });
    res.status(201).json({ success: true, data: chart });
  } catch (error) { next(error); }
};

export const getUserCharts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const charts = await Chart.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: charts });
  } catch (error) { next(error); }
};
