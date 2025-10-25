import express from 'express';
import upload from '../middleware/upload.js';
import {
  generateNewsletter,
  listNewsletters,
  getNewsletter,
  updateNewsletter,
  deleteNewsletter
} from '../controllers/newsletterController.js';

const router = express.Router();

// Rotas de newsletters
router.post('/generate', upload.array('files', 10), generateNewsletter);
router.get('/', listNewsletters);
router.get('/:id', getNewsletter);
router.put('/:id', updateNewsletter);
router.delete('/:id', deleteNewsletter);

export default router;
