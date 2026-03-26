import { Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import Chart from '../models/Chart';

export const getQuote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { symbol } = req.params;
    if (!symbol) return next(createError('Symbol is required', 400));

    // Mock response - replace with actual API call (Alpha Vantage / Finnhub)
    const quote = {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Inc.`,
      price: parseFloat((100 + Math.random() * 400).toFixed(2)),
      change: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)),
      changePercent: parseFloat(((Math.random() - 0.5) * 3).toFixed(2)),
      volume: Math.floor(Math.random() * 10_000_000),
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { interval = '1d', limit = '100' } = req.query;

    if (!symbol) return next(createError('Symbol is required', 400));

    // Mock historical data - replace with actual API call
    const count = parseInt(limit as string, 10);
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

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export const searchSymbol = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q) return next(createError('Query parameter is required', 400));

    // Mock search results
    const mockSymbols = ['AAPL', 'AMZN', 'GOOGL', 'META', 'MSFT', 'NVDA', 'TSLA'];
    const results = mockSymbols
      .filter((s) => s.includes((q as string).toUpperCase()))
      .map((symbol) => ({
        symbol,
        name: `${symbol} Inc.`,
        price: parseFloat((100 + Math.random() * 400).toFixed(2)),
        change: 0,
        changePercent: 0,
        volume: 0,
        timestamp: new Date().toISOString(),
      }));

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const saveChart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const chart = await Chart.create({ ...req.body, userId: req.user?.id });
    res.status(201).json({ success: true, data: chart });
  } catch (error) {
    next(error);
  }
};

export const getUserCharts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const charts = await Chart.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: charts });
  } catch (error) {
    next(error);
  }
};
