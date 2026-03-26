import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register({ username, email, password });
    res.status(201).json({
      success: true,
      data: { token: result.accessToken, refreshToken: result.refreshToken, user: result.user },
    });
  } catch (error) { next(error); }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      success: true,
      data: { token: result.accessToken, refreshToken: result.refreshToken, user: result.user },
    });
  } catch (error) { next(error); }
};

export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return next(createError('Refresh token is required', 400));
    const result = await authService.refreshToken(token);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) return next(createError('Email is required', 400));
    await authService.forgotPassword(email);
    res.json({ success: true, message: 'If an account exists with that email, a reset link has been sent' });
  } catch (error) { next(error); }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) { next(error); }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') return next(createError('Verification token is required', 400));
    await authService.verifyEmail(token);
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) { next(error); }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return next(createError('User not found', 404));
    res.json({ success: true, data: { id: user.id, username: user.username, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified, avatar: user.avatar, bio: user.bio } });
  } catch (error) { next(error); }
};
