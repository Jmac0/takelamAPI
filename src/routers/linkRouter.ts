import { Router } from 'express';
import {createSecureLink} from '../controllers/authController';

const router = Router();

router.get('/:id', createSecureLink);

export default router;