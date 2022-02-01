import mongoose from 'mongoose';

interface ContentInterface {
  about: string;
  interiorDesign: string;
  ukServices: string;
}
const contentSchema = new mongoose.Schema<ContentInterface>({
  about: {
    type: String,
    required: [true, 'About page cannot be blank'],
    minlength: [10, 'About page must have more than 10 characters'],
  },
  interiorDesign: {
    type: String,
    required: [true, 'Interiors page cannot be blank'],
    minlength: [10, 'Interiors page must have more than 10 characters'],
  },
  ukServices: {
    type: String,
    required: [true, 'Uk services page cannot be blank'],
    minlength: [10, 'Uk services page must have more than 10 characters'],
  },
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
