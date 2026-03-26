// Application constants

export const APP_NAME = 'منصة التحليل المالي';
export const APP_VERSION = '1.0.0';

// Chart intervals
export const CHART_INTERVALS = [
  { value: '1m', label: 'دقيقة' },
  { value: '5m', label: '5 دقائق' },
  { value: '15m', label: '15 دقيقة' },
  { value: '30m', label: '30 دقيقة' },
  { value: '1h', label: 'ساعة' },
  { value: '4h', label: '4 ساعات' },
  { value: '1d', label: 'يوم' },
  { value: '1w', label: 'أسبوع' },
] as const;

// Technical indicators
export const TECHNICAL_INDICATORS = [
  { value: 'MA', label: 'المتوسط المتحرك' },
  { value: 'EMA', label: 'المتوسط المتحرك الأسي' },
  { value: 'RSI', label: 'مؤشر القوة النسبية' },
  { value: 'MACD', label: 'ماكد' },
  { value: 'BB', label: 'بولينجر باندز' },
  { value: 'STOCH', label: 'ستوكاستيك' },
] as const;

// Signal colors
export const SIGNAL_COLORS = {
  BUY: '#48bb78',
  SELL: '#fc8181',
  HOLD: '#ed8936',
  NEUTRAL: '#a0aec0',
} as const;

// Popular symbols
export const POPULAR_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
  'META', 'NVDA', 'BRK.B', 'JPM', 'V',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
