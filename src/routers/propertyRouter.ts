import { Router } from 'express';

import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
 // resizePropertyImages,
  uploadImagesToCloud,
} from '../controllers/propertyController';
const router = Router();

router.route('/').get(getAllProperties).post(createProperty);
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
