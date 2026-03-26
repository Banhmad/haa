import { ApiResponse, StockQuote, CandlestickData, AnalysisResult, Opportunity } from '../types';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    fetchJson<ApiResponse<{ token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (username: string, email: string, password: string) =>
    fetchJson<ApiResponse<{ token: string }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),
};

// Chart API
export const chartApi = {
  getQuote: (symbol: string) =>
    fetchJson<ApiResponse<StockQuote>>(`/chart/quote/${symbol}`),

  getHistory: (symbol: string, interval: string, limit?: number) =>
    fetchJson<ApiResponse<CandlestickData[]>>(
      `/chart/history/${symbol}?interval=${interval}&limit=${limit || 100}`
    ),

  searchSymbol: (query: string) =>
    fetchJson<ApiResponse<StockQuote[]>>(`/chart/search?q=${encodeURIComponent(query)}`),
};

// Analysis API
export const analysisApi = {
  getTechnicalAnalysis: (symbol: string, interval: string) =>
    fetchJson<ApiResponse<AnalysisResult>>(`/analysis/technical/${symbol}?interval=${interval}`),

  getFundamentalAnalysis: (symbol: string) =>
    fetchJson<ApiResponse<AnalysisResult>>(`/analysis/fundamental/${symbol}`),

  getOpportunities: (filters?: Record<string, string>) => {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return fetchJson<ApiResponse<Opportunity[]>>(`/analysis/opportunities${params}`);
  },
};
