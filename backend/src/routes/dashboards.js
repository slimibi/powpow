import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import {
  createDashboard,
  getDashboards,
  getDashboard,
  updateDashboard,
  deleteDashboard,
  shareDashboard,
  getDashboardShares,
  removeDashboardShare,
  getPublicDashboards,
  getSharedDashboards,
  duplicateDashboard
} from '../controllers/dashboards.js';

const router = express.Router();

router.get('/public', optionalAuth, getPublicDashboards);

router.use(protect);

router.post('/', createDashboard);
router.get('/', getDashboards);
router.get('/shared', getSharedDashboards);
router.get('/:id', getDashboard);
router.put('/:id', updateDashboard);
router.delete('/:id', deleteDashboard);
router.post('/:id/duplicate', duplicateDashboard);
router.post('/:id/share', shareDashboard);
router.get('/:id/shares', getDashboardShares);
router.delete('/:id/shares/:userId', removeDashboardShare);

export default router;