import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import authService, { LoginPayload, RegisterPayload } from '../services/authService';
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../utils/localStorage';
import { User } from '../types';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const storedToken = getToken();
    const storedUser = getUser<User>();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const { token: newToken, user: newUser } = await authService.login(payload);
      setToken(newToken);
      setUser(newUser);
      setTokenState(newToken);
      setUserState(newUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const { token: newToken, user: newUser } = await authService.register(payload);
      setToken(newToken);
      setUser(newUser);
      setTokenState(newToken);
      setUserState(newUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      removeToken();
      removeUser();
      setTokenState(null);
      setUserState(null);
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const updatedUser = await authService.getProfile();
      setUser(updatedUser);
      setUserState(updatedUser);
    } catch {
      // silently fail; token may be expired
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
      register,
      refreshProfile,
    }),
    [user, token, isLoading, login, logout, register, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
