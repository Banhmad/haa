import { useState, useEffect, useCallback } from 'react';
import { chartApi } from '../utils/api';
import { StockQuote, CandlestickData } from '../types';

interface UseChartDataOptions {
  symbol: string;
  interval?: string;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseChartDataReturn {
  quote: StockQuote | null;
  history: CandlestickData[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useChartData({
  symbol,
  interval = '1d',
  limit = 100,
  autoRefresh = false,
  refreshInterval = 30000,
}: UseChartDataOptions): UseChartDataReturn {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [history, setHistory] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const [quoteRes, historyRes] = await Promise.all([
        chartApi.getQuote(symbol),
        chartApi.getHistory(symbol, interval, limit),
      ]);
      setQuote(quoteRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  }, [symbol, interval, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(fetchData, refreshInterval);
    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval, fetchData]);

  return { quote, history, loading, error, refresh: fetchData };
}
