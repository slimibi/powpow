import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

export default router;