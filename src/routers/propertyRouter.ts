import { Router } from 'express';


import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty, deleteProperty, uploadImage
} from '../controllers/propertyController';
const router = Router();

router.route('/').get(getAllProperties).post(createProperty);
router.route('/:id').get(getProperty).patch(uploadImage, updateProperty).delete(deleteProperty);

export default router;
