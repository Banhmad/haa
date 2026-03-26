import apiService from './apiService';
import { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProfileUpdatePayload {
  username?: string;
  email?: string;
}

const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/login', payload, { token: null });
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register', payload, { token: null });
  },

  async logout(): Promise<void> {
    try {
      await apiService.post<void>('/auth/logout');
    } catch {
      // ignore server errors on logout
    }
  },

  async getProfile(): Promise<User> {
    return apiService.get<User>('/auth/profile');
  },

  async updateProfile(payload: ProfileUpdatePayload): Promise<User> {
    return apiService.put<User>('/auth/profile', payload);
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>('/auth/forgot-password', { email }, { token: null });
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return apiService.post<{ message: string }>(
      '/auth/reset-password',
      { token, newPassword },
      { token: null },
    );
  },
};

export default authService;
