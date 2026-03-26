import { CandlestickData, AnalysisResult } from '../types';

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage value
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a timestamp to a readable date string
 */
export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a timestamp to a readable time string
 */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate the percentage change between two values
 */
export function calcChangePercent(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Determine the color class for a value (positive/negative)
 */
export function getChangeColorClass(value: number): string {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

/**
 * Calculate simple moving average from candlestick data
 */
export function calculateSMA(data: CandlestickData[], period: number): number[] {
  const closes = data.map((d) => d.close);
  const result: number[] = [];
  for (let i = period - 1; i < closes.length; i++) {
    const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
}

/**
 * Get signal label in Arabic
 */
export function getSignalLabel(signal: AnalysisResult['signal']): string {
  const labels: Record<AnalysisResult['signal'], string> = {
    BUY: 'شراء',
    SELL: 'بيع',
    HOLD: 'انتظار',
    NEUTRAL: 'محايد',
  };
  return labels[signal] || signal;
}
