import crypto from 'crypto';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import logger from '../utils/logger';
import { JWT_REFRESH_SECRET } from '../config/constants';
import { createError, AppError } from '../middleware/errorHandler';
import * as emailService from './emailService';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const { username, email, password } = data;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw createError('User with this email or username already exists', 409);

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({
    username,
    email,
    password,
    emailVerificationToken: verificationToken,
  });

  await emailService.sendWelcomeEmail(email, username).catch((err) => logger.warn(`Failed to send welcome email to ${email}: ${err.message}`));
  await emailService.sendVerificationEmail(email, verificationToken, username).catch((err) => logger.warn(`Failed to send verification email to ${email}: ${err.message}`));

  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);
  return { accessToken, refreshToken, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw createError('Invalid email or password', 401);
  }
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);
  return { accessToken, refreshToken, user: { id: user.id, username: user.username, email: user.email, role: user.role } };
};

export const refreshToken = async (token: string) => {
  try {
    const payload = verifyToken(token, JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) throw createError('User not found', 404);
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = generateRefreshToken(user.id);
    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    if ((err as AppError).isOperational) throw err;
    throw createError('Invalid or expired refresh token', 401);
  }
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  // Always respond success to prevent email enumeration
  if (!user) return;
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });
  await emailService.sendPasswordResetEmail(email, resetToken).catch((err) => logger.warn(`Failed to send password reset email to ${email}: ${err.message}`));
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) throw createError('Invalid or expired reset token', 400);
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

export const verifyEmail = async (token: string) => {
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) throw createError('Invalid verification token', 400);
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save({ validateBeforeSave: false });
};
