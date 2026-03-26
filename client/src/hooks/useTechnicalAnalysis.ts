import { useState, useEffect, useCallback } from 'react';
import { analysisApi } from '../utils/api';
import { AnalysisResult } from '../types';

interface UseTechnicalAnalysisOptions {
  symbol: string;
  interval?: string;
}

interface UseTechnicalAnalysisReturn {
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTechnicalAnalysis({
  symbol,
  interval = '1d',
}: UseTechnicalAnalysisOptions): UseTechnicalAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      const response = await analysisApi.getTechnicalAnalysis(symbol, interval);
      setResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return { result, loading, error, refresh: fetchAnalysis };
}
