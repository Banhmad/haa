const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // storage unavailable
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable
  }
};

export const getUser = <T = unknown>(): T | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const setUser = (user: unknown): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // storage unavailable
  }
};

export const removeUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // storage unavailable
  }
};

export const clearAll = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // storage unavailable
  }
};
