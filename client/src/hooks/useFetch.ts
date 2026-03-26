import { useState, useCallback, useRef } from 'react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface FetchOptions<B = unknown> {
  method?: HttpMethod;
  body?: B;
  headers?: Record<string, string>;
  immediate?: boolean;
}

interface UseFetchReturn<T, B = unknown> extends FetchState<T> {
  refetch: (overrideBody?: B) => Promise<void>;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export function useFetch<T = unknown, B = unknown>(
  path: string,
  options: FetchOptions<B> = {},
): UseFetchReturn<T, B> {
  const { method = 'GET', body, headers: extraHeaders } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(
    async (overrideBody?: B) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ data: null, loading: true, error: null });

      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...extraHeaders,
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const requestBody = overrideBody !== undefined ? overrideBody : body;
        const res = await fetch(`${BASE_URL}${path}`, {
          method,
          headers,
          signal: controller.signal,
          body:
            method !== 'GET' && requestBody !== undefined
              ? JSON.stringify(requestBody)
              : undefined,
        });

        const text = await res.text();
        let data: unknown;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text;
        }

        if (!res.ok) {
          const message =
            (data as { message?: string })?.message || `خطأ ${res.status}`;
          setState({ data: null, loading: false, error: message });
          return;
        }

        setState({ data: data as T, loading: false, error: null });
      } catch (err: unknown) {
        if ((err as { name?: string }).name === 'AbortError') return;
        setState({
          data: null,
          loading: false,
          error: (err as Error).message || 'حدث خطأ غير متوقع',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path, method, JSON.stringify(body), JSON.stringify(extraHeaders)],
  );

  return { ...state, refetch };
}

export default useFetch;
