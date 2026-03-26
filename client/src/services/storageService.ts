const storageService = {
  getItem<T = unknown>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable or quota exceeded
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // storage unavailable
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      // storage unavailable
    }
  },
};

export default storageService;
