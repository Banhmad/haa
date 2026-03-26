import { Router } from 'express';
import { getQuote, getHistory, searchSymbol, saveChart, getUserCharts, getCryptoPrice } from '../controllers/chartController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.get('/quote/:symbol', getQuote);
router.get('/history/:symbol', getHistory);
router.get('/search', searchSymbol);
router.get('/crypto/:coinId', getCryptoPrice);
router.post('/save', authenticate, saveChart);
router.get('/my-charts', authenticate, getUserCharts);
export default router;
