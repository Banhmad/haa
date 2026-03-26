const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface RequestOptions {
  headers?: Record<string, string>;
  token?: string | null;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const buildHeaders = (options?: RequestOptions): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  const token =
    options?.token !== undefined
      ? options.token
      : localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message =
      (data as { message?: string; error?: string })?.message ||
      (data as { message?: string; error?: string })?.error ||
      `خطأ ${res.status}`;
    throw new ApiError(res.status, message, data);
  }
  return data as T;
};

const apiService = {
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: buildHeaders(options),
    });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(options),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(options),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: buildHeaders(options),
    });
    return handleResponse<T>(res);
  },
};

export { ApiError };
export default apiService;
