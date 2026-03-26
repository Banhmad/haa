import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthContext, AuthContextValue } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';

const buildMockAuth = (overrides?: Partial<AuthContextValue>): AuthContextValue => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  refreshProfile: jest.fn(),
  ...overrides,
});

const wrapper =
  (value: AuthContextValue): React.FC<{ children: React.ReactNode }> =>
  ({ children }) =>
    React.createElement(AuthContext.Provider, { value }, children);

describe('useAuth hook', () => {
  it('يجب أن يُرجع قيم السياق الافتراضية', () => {
    const mock = buildMockAuth();
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(mock) });
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('يجب أن يستدعي login بالبيانات الصحيحة', async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    const mock = buildMockAuth({ login: mockLogin });
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(mock) });
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'Password1' });
    });
    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'Password1' });
  });

  it('يجب أن يستدعي logout', async () => {
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    const mock = buildMockAuth({ logout: mockLogout });
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(mock) });
    await act(async () => {
      await result.current.logout();
    });
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('يجب أن يُرجع isAuthenticated=true عند وجود مستخدم وtوكن', () => {
    const mock = buildMockAuth({
      user: {
        id: '1',
        username: 'ahmed',
        email: 'a@b.com',
        role: 'student',
        createdAt: new Date().toISOString(),
      },
      token: 'some-token',
      isAuthenticated: true,
    });
    const { result } = renderHook(() => useAuth(), { wrapper: wrapper(mock) });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.username).toBe('ahmed');
  });

  it('يجب أن يرمي خطأ عند الاستخدام خارج AuthProvider', () => {
    // Suppress the expected console error
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider',
    );
    spy.mockRestore();
  });
});
