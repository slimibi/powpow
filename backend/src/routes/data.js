import express from 'express';
import { protect, optionalAuth } from '../middleware/auth.js';
import { uploadFile, handleUploadError } from '../middleware/upload.js';
import {
  uploadFile as uploadFileController,
  getDataSources,
  getDataSource,
  getDataSourceData,
  updateDataSource,
  deleteDataSource,
  getPublicDataSources
} from '../controllers/data.js';

const router = express.Router();

router.get('/public', optionalAuth, getPublicDataSources);

router.use(protect);

router.post('/upload', uploadFile.single('file'), handleUploadError, uploadFileController);
router.get('/', getDataSources);
router.get('/:id', getDataSource);
router.get('/:id/data', getDataSourceData);
router.put('/:id', updateDataSource);
router.delete('/:id', deleteDataSource);

export default router;