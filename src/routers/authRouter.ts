import { Router } from 'express';
import {createSecureLink, createAdmin, protect, loginAdmin, updateUser, forgotPassword, resetPassword} from '../controllers/authController';
const xss = require('xss-clean');

const router = Router();
 //  create encrypted link
router.get('/:id',protect, createSecureLink);
router.patch('/resetpassword/:token', resetPassword);
router.use(xss());
router.post('/forgotpassword', forgotPassword);
router.post('/create', createAdmin);
router.post('/login', loginAdmin);
router.patch('/update',protect, updateUser);
export default router;