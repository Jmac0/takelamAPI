import { Router } from 'express';
import {
  getContent,
  createContent,
  updateContent,
} from '../controllers/contentController';

import {protect} from '../controllers/authController'


const router = Router();

router.route('/').get(getContent).post(protect, createContent);
router.route('/:id').patch(protect, updateContent)

export default router;
