import { Router } from 'express';
import { protect } from '../controllers/authController';

import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  uploadFloorPlan,
  // resizePropertyImages,
  getPropertyClient,
  uploadImagesToCloud,
} from '../controllers/propertyController';
const router = Router();

router.route('/').get(protect, getAllProperties).post(protect, createProperty);
router.route('/client/:id').get(getPropertyClient);

router
  .route('/:id')
  .get(protect, getProperty)
  .patch(protect,
    uploadPropertyImages,
    uploadFloorPlan,
    //resizePropertyImages,
    uploadImagesToCloud,
    updateProperty
  )
  .delete(protect, deleteProperty);

export default router;
