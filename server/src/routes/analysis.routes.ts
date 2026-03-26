import { Router } from 'express';
import { getTechnicalAnalysis, getFundamentalAnalysis, getOpportunities } from '../controllers/analysisController';

const router = Router();

router.get('/technical/:symbol', getTechnicalAnalysis);
router.get('/fundamental/:symbol', getFundamentalAnalysis);
router.get('/opportunities', getOpportunities);

export default router;
