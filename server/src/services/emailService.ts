import logger from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // Mock implementation - replace with nodemailer when available
  logger.info(`[EMAIL SERVICE] To: ${options.to} | Subject: ${options.subject}`);
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`[EMAIL BODY] ${options.html}`);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });
};

export const sendWelcomeEmail = async (email: string, username: string): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Welcome to HAA Financial Platform',
    html: `<h1>Welcome, ${username}!</h1><p>Thank you for joining the HAA Financial Analysis Platform.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string, username: string): Promise<void> => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Hello ${username}, please <a href="${verifyUrl}">verify your email</a>.</p>`,
  });
};
