import express from 'express';
import {
  createAudience,
  listAudiences,
  getAudience,
  updateAudience,
  deleteAudience
} from '../controllers/audienceController.js';

const router = express.Router();

// Rotas de públicos-alvo
router.post('/', createAudience);
router.get('/', listAudiences);
router.get('/:id', getAudience);
router.put('/:id', updateAudience);
router.delete('/:id', deleteAudience);

export default router;
