import { Router } from 'express';
import {createSecureLink, createAdmin, protect, loginAdmin, updateUser} from '../controllers/authController';

const router = Router();
 //  create encrypted link
router.get('/:id', createSecureLink);

router.post('/create', createAdmin);
router.post('/login', loginAdmin);
router.patch('/update',protect, updateUser);
export default router;