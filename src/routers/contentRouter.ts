import {Router} from 'express';
import {getContent} from "../controllers/contentController";

const router = Router();

////// todo import content controller

router.route('/').get(getContent)
.post()
.patch()
.delete()

export default router;