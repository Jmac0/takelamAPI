import { Router } from 'express';
import {createSecureLink, createAdmin, loginAdmin} from '../controllers/authController';

const router = Router();
 //  create encrypted link
router.get('/:id', createSecureLink);

router.post('/create', createAdmin);
router.post('/login', loginAdmin);
export default router;