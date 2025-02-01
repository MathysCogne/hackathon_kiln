import { Router } from 'express';
import chatbotRoutes from './chatbotRoutes.js';
import kilnRoutes from './kilnRoutes.js';
import pythonRoutes from './pythonRoutes.js';
import brainRoutes from './brainRoutes.js';

const router = Router();

router.use('/chatbot', chatbotRoutes);
router.use('/kiln', kilnRoutes);
router.use('/python', pythonRoutes);
router.use('/brain', brainRoutes);

export default router;
