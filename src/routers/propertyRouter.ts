import { Router } from 'express';
import {protect} from '../controllers/authController';

import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
 // resizePropertyImages,
  getPropertyClient,
  uploadImagesToCloud,
} from '../controllers/propertyController';
const router = Router();

router.route('/').get(getAllProperties).post(createProperty);
router.route('/client/:id').get(getPropertyClient);

router
  .route('/:id')
  .get(getProperty)
  .patch(
    uploadPropertyImages,
//    resizePropertyImages,
    uploadImagesToCloud,
    updateProperty)
  .delete(deleteProperty);

export default router;
