import logger from './logger';

export const sendPasswordResetEmail = async (email: string, token: string, username: string): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  logger.info(`[EMAIL] Password reset email to ${email} (${username}): ${resetUrl}`);
};

export const sendVerificationEmail = async (email: string, token: string, username: string): Promise<void> => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  logger.info(`[EMAIL] Verification email to ${email} (${username}): ${verifyUrl}`);
};

export const sendWelcomeEmail = async (email: string, username: string): Promise<void> => {
  logger.info(`[EMAIL] Welcome email to ${email} (${username})`);
};
