import { Router } from 'express';
import {
  getContent,
  createContent,
  updateContent,
} from '../controllers/contentController';

const router = Router();

router.route('/').get(getContent).post(createContent);
router.route('/:id').patch(updateContent).delete();

export default router;
