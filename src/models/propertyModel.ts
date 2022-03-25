import mongoose from 'mongoose';

interface PropertyInterface {
  title: { title: string; unique: boolean };
  tag: { tag: string; unique: boolean };
  description: string;
  ownership: string;
  plotSize: string;
  buildSize: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  location: string;
  cords: string;
  floorPlan: [string];
}

const propertySchema = new mongoose.Schema<PropertyInterface>({
  title: {
    unique: [true, 'Property names must be unique please chose another name'],
    type: String,
    required: [true, 'A property must have a title'],
  },
  tag: {
    unique: [true, 'Tags be unique please chose another name'],
    type: String,
    required: [true, 'A property must have a tag'],
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
  /*google geo data */
  cords: [],


  floorPlan: [String],
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
