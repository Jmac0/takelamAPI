import { Router } from 'express';
import {createSecureLink, createAdmin, protect, loginAdmin, updateUser, forgotPassword, restPassword} from '../controllers/authController';

const router = Router();
 //  create encrypted link
router.get('/:id', createSecureLink);

router.post('/create', createAdmin);
router.post('/login', loginAdmin);
router.patch('/update',protect, updateUser);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', restPassword);
export default router;