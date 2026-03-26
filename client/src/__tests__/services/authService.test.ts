import authService from '../../services/authService';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockLocalStorage: Record<string, string> = {};
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: (key: string) => mockLocalStorage[key] ?? null,
    setItem: (key: string, val: string) => { mockLocalStorage[key] = val; },
    removeItem: (key: string) => { delete mockLocalStorage[key]; },
    clear: () => { Object.keys(mockLocalStorage).forEach((k) => delete mockLocalStorage[k]); },
  },
});

const mockResponse = (data: unknown, ok = true, status = 200) =>
  Promise.resolve({
    ok,
    status,
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage['token'] = 'test-token';
  });

  describe('login', () => {
    it('يجب أن يُرجع token و user عند نجاح تسجيل الدخول', async () => {
      const payload = { email: 'user@example.com', password: 'Password1' };
      const response = { token: 'jwt-token', user: { id: '1', username: 'user', email: payload.email } };
      mockFetch.mockReturnValue(mockResponse(response));

      const result = await authService.login(payload);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({ method: 'POST', body: JSON.stringify(payload) }),
      );
      expect(result.token).toBe('jwt-token');
    });

    it('يجب أن يرمي ApiError عند فشل تسجيل الدخول', async () => {
      mockFetch.mockReturnValue(mockResponse({ message: 'بيانات غير صحيحة' }, false, 401));
      await expect(
        authService.login({ email: 'bad@example.com', password: 'wrong' }),
      ).rejects.toThrow('بيانات غير صحيحة');
    });
  });

  describe('register', () => {
    it('يجب أن يُرجع token و user عند نجاح إنشاء الحساب', async () => {
      const payload = { username: 'newuser', email: 'new@example.com', password: 'Password1' };
      const response = { token: 'new-jwt', user: { id: '2', username: 'newuser', email: payload.email } };
      mockFetch.mockReturnValue(mockResponse(response));

      const result = await authService.register(payload);
      expect(result.token).toBe('new-jwt');
    });
  });

  describe('forgotPassword', () => {
    it('يجب أن يُرسل طلب إعادة تعيين كلمة المرور', async () => {
      mockFetch.mockReturnValue(mockResponse({ message: 'تم الإرسال' }));
      const result = await authService.forgotPassword('user@example.com');
      expect(result.message).toBe('تم الإرسال');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/forgot-password'),
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  describe('getProfile', () => {
    it('يجب أن يُرجع بيانات المستخدم', async () => {
      const user = { id: '1', username: 'ahmed', email: 'a@b.com', role: 'student' };
      mockFetch.mockReturnValue(mockResponse(user));
      const result = await authService.getProfile();
      expect(result.username).toBe('ahmed');
    });
  });

  describe('logout', () => {
    it('يجب أن يُكمل بدون خطأ حتى لو فشل الطلب', async () => {
      mockFetch.mockReturnValue(mockResponse({ message: 'error' }, false, 500));
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });
});
