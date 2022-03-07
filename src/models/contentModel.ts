import mongoose from 'mongoose';


interface ContentInterface {
  componentName: {componentName: string, unique: boolean  }
  path: {componentName: string, unique: boolean  }
  heading: string;
  bodyText: string;
}


const contentSchema = new mongoose.Schema<ContentInterface>({
  componentName: {
    unique: [true, 'Component names must be unique please chose another name'],
    type: String,
    required: [true, 'A component must have a title'],
  },
  path: {
    unique: [true, 'Url path must be unique please chose another name'],
    type: String,
    required: [true, 'A Page must have a URL'],
  },
  heading: {
    type: String,
    required: [true, 'A page must have a heading'],
    minlength: [3, 'A page heading must have more than 3 characters'],
  },
  bodyText: {
    type: String,
    required: [true, 'A page must have some content '],
    minlength: [4, 'Page content must be more than 4 characters long'],
  },
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
