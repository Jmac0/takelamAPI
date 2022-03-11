import mongoose from 'mongoose';

interface PropertyInterface {
  title: { title: string; unique: boolean };
  description: string;
  ownership: string;
  plotSize: string;
  buildSize: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  location: string;
  map: string;
  images: [string];
  floorPlan: [string];
  cloudinary_id: string;
}

const propertySchema = new mongoose.Schema<PropertyInterface>({
  title: {
    unique: [true, 'Property names must be unique please chose another name'],
    type: String,
    required: [true, 'A property must have a title'],
  },
  description: {
    type: String,
    required: [true, 'A property must have a description'],
    minlength: [10, 'A description must have more than 10 characters'],
  },
  ownership: {
    type: String,
    required: [true, 'A property must have ownership details'],
  },
  plotSize: {
    type: String,
    required: [true, 'A property must have a plot size '],
  },
  buildSize: {
    type: Number,
    required: [true, 'A property must have a build size'],
  },
  bedrooms: {
    type: Number,
  },
  bathrooms: {
    type: Number,
  },

  price: {
    type: Number,
  },

  location: {
    type: String,
  },
  /*google geo data? */
  map: String,

  images: [String],

  cloudinary_id: String,

  floorPlan: [String],
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
