import { Router } from 'express';
import {getPropertyClient} from '../controllers/clientController'

const router = Router();

router.get('/:link', getPropertyClient);

export default router;
