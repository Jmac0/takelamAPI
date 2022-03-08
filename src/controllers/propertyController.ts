import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';
const cloudinary = require("../utils/cloudinary");
import Property from '../models/propertyModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';
/*
type FileFilterCallback = (error: Error | null, fileType: boolean) => void;
type FileDestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, fileName: string) => void;

*/
/////////// Multer upload image to file system  /////////////////////////
/*
const multerStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: FileDestinationCallback) => {
    cb(null, `dist/properties/propertyImages`);

  },

  filename: (req: any, file: Express.Multer.File, cb: FileNameCallback) => {
// extract file extension from uploaded image
    const ext = file.mimetype.split('/')[1];
cb(null, `property-${req.params.id}-${Date.now()}.${ext}`)

    },

});

const multerFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('File not an image please upload an image', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});


const uploadImage = upload.single('image');

*/
//////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const getAllProperties: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const property = await Property.find();
    if (property.length === 0) {
      return next(
        new AppError('Nothing found in database: contact developer', 404)
      );
    }
    res.status(200).json({
      property,
    });
  }
);

const getProperty: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = (req.params as { id: string }).id;
    const property = await Property.findById(id);
    if (!property) {
      return next(new AppError(`Property not found`, 404));
    }
    res.status(200).json({
      property,
    });
  }
);
const createProperty: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const newProperty = await Property.create(req.body);

    res.status(201).json({
      status: 'Ok',
      content: newProperty,
    });
  }
);



const updateProperty: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // spread request object into new
    const body = {... req.body}
    // check for image and add to body
    if(req.file) body.image = req.file.filename;
    //const result = await cloudinary.uploader.upload(req.file.path);
    // @ts-ignore
    cloudinary.uploader.upload(`${req.file.path}`, function(error, result) {console.log(result, error)});
    console.log(req.file)
    const id = (req.params as { id: string }).id;
    const property = await Property.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return next(new AppError('No content found', 404));
    }

    res.status(200).json({
      status: 'ok',
      data: property,
    });
  }
);

const deleteProperty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = (req.params as { id: string }).id;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      // return early and call next with a argument = go to error handler

      // return early and call next with a argument = go to error handler
      return next(new AppError(`Property: ${id} not found `, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

export {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  //uploadImage,
};
