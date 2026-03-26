import { Router } from 'express';
import { getQuote, getHistory, searchSymbol, saveChart, getUserCharts } from '../controllers/chartController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/quote/:symbol', getQuote);
router.get('/history/:symbol', getHistory);
router.get('/search', searchSymbol);

// Protected routes (require authentication)
router.post('/save', authenticate, saveChart);
router.get('/my-charts', authenticate, getUserCharts);

export default router;
