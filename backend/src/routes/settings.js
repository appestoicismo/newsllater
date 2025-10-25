import express from 'express';
import {
  getSettings,
  updateSetting,
  updateSettings
} from '../controllers/settingsController.js';

const router = express.Router();

// Rotas de configurações
router.get('/', getSettings);
router.post('/', updateSettings);
router.post('/single', updateSetting);

export default router;
