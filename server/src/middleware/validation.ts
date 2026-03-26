import { Request, Response, NextFunction } from 'express';
import { isValidEmail, isValidPassword, isValidUsername, sanitizeInput } from '../utils/validators';
import { createError } from './errorHandler';

export const validateRegister = (req: Request, _res: Response, next: NextFunction): void => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return next(createError('Username, email and password are required', 400));
  if (!isValidUsername(sanitizeInput(username))) return next(createError('Username must be 3-30 alphanumeric characters or underscores', 400));
  if (!isValidEmail(sanitizeInput(email))) return next(createError('Please provide a valid email', 400));
  if (!isValidPassword(password)) return next(createError('Password must be at least 8 characters with uppercase, lowercase and number', 400));
  next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  if (!email || !password) return next(createError('Email and password are required', 400));
  if (!isValidEmail(sanitizeInput(email))) return next(createError('Please provide a valid email', 400));
  next();
};

export const validatePasswordReset = (req: Request, _res: Response, next: NextFunction): void => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return next(createError('Token and new password are required', 400));
  if (!isValidPassword(newPassword)) return next(createError('Password must be at least 8 characters with uppercase, lowercase and number', 400));
  next();
};

export const validateProfileUpdate = (req: Request, _res: Response, next: NextFunction): void => {
  const { username, bio } = req.body;
  if (username && !isValidUsername(sanitizeInput(username))) return next(createError('Username must be 3-30 alphanumeric characters or underscores', 400));
  if (bio !== undefined) {
    const sanitizedBio = sanitizeInput(String(bio));
    if (sanitizedBio.length > 500) return next(createError('Bio must be 500 characters or less', 400));
    req.body.bio = sanitizedBio;
  }
  next();
};
