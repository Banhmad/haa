import { Request, Response, NextFunction } from 'express';
import { createError } from '../middleware/errorHandler';

export const getTechnicalAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { symbol } = req.params;
    const { interval = '1d' } = req.query;

    if (!symbol) return next(createError('Symbol is required', 400));

    // Mock technical analysis - replace with actual computation
    const signals = ['BUY', 'SELL', 'HOLD', 'NEUTRAL'] as const;
    const signal = signals[Math.floor(Math.random() * signals.length)];

    const result = {
      symbol: symbol.toUpperCase(),
      timestamp: new Date().toISOString(),
      signal,
      confidence: parseFloat((50 + Math.random() * 50).toFixed(1)),
      indicators: [
        { name: 'RSI (14)', value: parseFloat((30 + Math.random() * 40).toFixed(1)), signal: 'NEUTRAL' },
        { name: 'MACD', value: parseFloat((Math.random() * 2 - 1).toFixed(3)), signal: Math.random() > 0.5 ? 'BUY' : 'SELL' },
        { name: 'MA (20)', value: parseFloat((140 + Math.random() * 20).toFixed(2)), signal: 'BUY' },
        { name: 'EMA (50)', value: parseFloat((135 + Math.random() * 20).toFixed(2)), signal: 'NEUTRAL' },
        { name: 'Bollinger Bands', value: 'Middle', signal: 'NEUTRAL' },
        { name: 'Stochastic', value: parseFloat((20 + Math.random() * 60).toFixed(1)), signal: 'NEUTRAL' },
      ],
      summary: `التحليل الفني لـ ${symbol.toUpperCase()} على الإطار الزمني ${interval} يشير إلى إشارة ${signal} بناءً على مجموع المؤشرات الفنية.`,
    };

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getFundamentalAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { symbol } = req.params;
    if (!symbol) return next(createError('Symbol is required', 400));

    // Mock fundamental data - replace with actual data source
    const result = {
      symbol: symbol.toUpperCase(),
      companyName: `${symbol.toUpperCase()} Corporation`,
      sector: 'Technology',
      industry: 'Software',
      peRatio: parseFloat((15 + Math.random() * 35).toFixed(2)),
      pbRatio: parseFloat((1 + Math.random() * 10).toFixed(2)),
      epsGrowth: parseFloat(((Math.random() - 0.2) * 30).toFixed(2)),
      debtToEquity: parseFloat((Math.random() * 2).toFixed(2)),
      currentRatio: parseFloat((1 + Math.random() * 3).toFixed(2)),
      returnOnEquity: parseFloat((5 + Math.random() * 30).toFixed(2)),
      dividendYield: parseFloat((Math.random() * 4).toFixed(2)),
      revenueGrowth: parseFloat(((Math.random() - 0.1) * 25).toFixed(2)),
    };

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getOpportunities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type } = req.query;

    const opportunityTypes = ['BREAKOUT', 'REVERSAL', 'TREND', 'PATTERN'] as const;
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'];
    const directions = ['LONG', 'SHORT'] as const;

    let opportunities = symbols.map((symbol, i) => {
      const entryPrice = parseFloat((100 + Math.random() * 400).toFixed(2));
      const direction = directions[i % 2];
      const target = direction === 'LONG'
        ? parseFloat((entryPrice * (1 + Math.random() * 0.15)).toFixed(2))
        : parseFloat((entryPrice * (1 - Math.random() * 0.15)).toFixed(2));
      const stop = direction === 'LONG'
        ? parseFloat((entryPrice * (1 - Math.random() * 0.05)).toFixed(2))
        : parseFloat((entryPrice * (1 + Math.random() * 0.05)).toFixed(2));

      return {
        id: `opp-${i + 1}`,
        symbol,
        type: opportunityTypes[i % opportunityTypes.length],
        direction,
        entryPrice,
        targetPrice: target,
        stopLoss: stop,
        riskRewardRatio: parseFloat((Math.abs(target - entryPrice) / Math.abs(stop - entryPrice)).toFixed(1)),
        confidence: parseFloat((60 + Math.random() * 40).toFixed(1)),
        description: `فرصة ${direction === 'LONG' ? 'شراء' : 'بيع'} في ${symbol} بناءً على نمط ${opportunityTypes[i % opportunityTypes.length]}`,
        createdAt: new Date().toISOString(),
      };
    });

    if (type) {
      opportunities = opportunities.filter((o) => o.type === type);
    }

    res.json({ success: true, data: opportunities });
  } catch (error) {
    next(error);
  }
};
