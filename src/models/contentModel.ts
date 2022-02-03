import mongoose from 'mongoose';


interface ContentInterface {
  aboutTitle: {aboutTitle: string, unique: boolean[]};
  about: string;
  interiorsTitle: string;
  interiors: string;
  ukServicesTitle: string;
  ukServices: string;
}
//todo remove unique
const contentSchema = new mongoose.Schema<ContentInterface>({
  aboutTitle: {
    unique: [true, 'must be unique'],
    type: String,
    required: [true, 'About Page must have a title'],
    minlength: [4, 'Title must be more than 4 characters'],
  },
  about: {
    type: String,
    required: [true, 'About page cannot be blank'],
    minlength: [10, 'About page must have more than 10 characters'],
  },
  interiorsTitle: {
    type: String,
    required: [true, 'Interiors Page must have a title'],
    minlength: [4, 'Title must be more than 4 characters'],
  },
  interiors: {
    type: String,
    required: [true, 'Interiors page cannot be blank'],
    minlength: [10, 'Interiors page must have more than 10 characters'],
  },
  ukServicesTitle: {
    type: String,
    required: [true, 'Uk Services Page must have a title'],
    minlength: [4, 'Title must be more than 4 characters'],
  },
  ukServices: {
    type: String,
    required: [true, 'Uk services page cannot be blank'],
    minlength: [10, 'Uk services page must have more than 10 characters'],
  },
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
