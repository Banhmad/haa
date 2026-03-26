import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants';
import { createError } from '../middleware/errorHandler';

const signToken = (id: string, email: string, role: string): string => {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as string & jwt.SignOptions['expiresIn'] });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(createError('Please provide username, email and password', 400));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(createError('User with this email or username already exists', 409));
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user.id, user.email, user.role);

    res.status(201).json({
      success: true,
      data: { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(createError('Invalid email or password', 401));
    }

    const token = signToken(user.id, user.email, user.role);

    res.json({
      success: true,
      data: { token, user: { id: user.id, username: user.username, email: user.email, role: user.role } },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request & { user?: { id: string } }, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return next(createError('User not found', 404));
    }
    res.json({ success: true, data: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};
