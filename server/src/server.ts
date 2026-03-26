import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { SERVER_PORT, NODE_ENV, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } from './config/constants';
import authRoutes from './routes/auth.routes';
import chartRoutes from './routes/chart.routes';
import analysisRoutes from './routes/analysis.routes';
import userRoutes from './routes/user.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
const limiter = rateLimit({ windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX, message: 'Too many requests from this IP, please try again later.' });
app.use('/api', limiter);
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/user', userRoutes);
app.get('/api/health', (_req, res) => { res.json({ status: 'ok', timestamp: new Date().toISOString() }); });
app.use(notFoundHandler);
app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(SERVER_PORT, () => { logger.info(`Server running on port ${SERVER_PORT} in ${NODE_ENV} mode`); });
  } catch (error) { logger.error('Failed to start server:', error); process.exit(1); }
};
startServer();
export default app;
