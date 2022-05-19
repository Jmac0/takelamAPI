import { isAuth } from '../controllers/authController';
import { Router } from "express";
// used for persistent login
const router = Router();

router.get('/isAuth', isAuth)

export default router