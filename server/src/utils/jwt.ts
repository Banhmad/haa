import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from '../config/constants';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const generateAccessToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string, secret: string = JWT_SECRET): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const decodeToken = (token: string): JwtPayload | null => {
  const decoded = jwt.decode(token);
  return decoded as JwtPayload | null;
};
