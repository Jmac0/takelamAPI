import { Router } from 'express';
import { getContent, createContent } from '../controllers/contentController';

const router = Router();

router.route('/').get(getContent).post(createContent).patch().delete();

export default router;
