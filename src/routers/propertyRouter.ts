import { Router } from 'express';
const upload = require('../utils/multer');

import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  // uploadImage
} from '../controllers/propertyController';
const router = Router();

router.route('/').get(getAllProperties).post(createProperty);
router
  .route('/:id')
  .get(getProperty)
  .patch(upload.single('image'), updateProperty)
  .delete(deleteProperty);

export default router;
