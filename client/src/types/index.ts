// User types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
}

// Chart / Market data types
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high52w?: number;
  low52w?: number;
  timestamp: string;
}

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ChartConfig {
  symbol: string;
  interval: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
  chartType: 'candlestick' | 'line' | 'bar';
  indicators: TechnicalIndicator[];
}

// Technical Analysis types
export interface TechnicalIndicator {
  name: string;
  type: 'MA' | 'EMA' | 'RSI' | 'MACD' | 'BB' | 'STOCH';
  params: Record<string, number>;
  enabled: boolean;
}

export interface AnalysisResult {
  symbol: string;
  timestamp: string;
  signal: 'BUY' | 'SELL' | 'HOLD' | 'NEUTRAL';
  confidence: number;
  indicators: {
    name: string;
    value: number | string;
    signal: string;
  }[];
  summary: string;
}

// Fundamental Analysis types
export interface FundamentalData {
  symbol: string;
  companyName: string;
  sector: string;
  industry: string;
  peRatio: number;
  pbRatio: number;
  epsGrowth: number;
  debtToEquity: number;
  currentRatio: number;
  returnOnEquity: number;
  dividendYield?: number;
  revenueGrowth: number;
}

// Opportunities types
export interface Opportunity {
  id: string;
  symbol: string;
  type: 'BREAKOUT' | 'REVERSAL' | 'TREND' | 'PATTERN';
  direction: 'LONG' | 'SHORT';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskRewardRatio: number;
  confidence: number;
  description: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}
