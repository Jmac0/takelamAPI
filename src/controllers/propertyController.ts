import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';
const sharp = require('sharp');
const cloudinary = require('../utils/cloudinary');
// multer instance and config file
const upload = require('../utils/multer');
import Property from '../models/propertyModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';
import { Error } from 'mongoose';
// multer method to upload multiple images puts files on req.body.files
const uploadPropertyImages = upload.array('images', 20);
// resize property images for gallery
const resizePropertyImages: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if file is on request object
    if (!req.files) return next();
    req.body.images = [];
    // resize images
    await Promise.all(
      // @ts-ignore
      req.files.map(async (image, i) => {
        // @ts-ignore
        await sharp(req!.files[i].path).resize(200, 200);

        req.body.images.push({ path: image.path, name: image.originalname });
      })
    );
    console.log(req.body.images);

    next();
  }
);
// uploads multiple images to cloudinary server
const uploadImagesToCloud: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // get property name for cloudinary folder
    const id = (req.params as { id: string }).id;
    const property = await Property.findById(id);
    if(!property) return new AppError('No property found', 404)

    // new property on req object for cloudinary responses
    req.body.cloudImages = [];
    // map over images array and await promises
    await Promise.all(
      req.body.images.map(async (image: { name: string; path: string }) => {
        // @ts-ignore
        await cloudinary.v2.uploader
          .upload(image.path, {
            public_id: `${property.title}/${image.name}`,
            tags: [`${property.title}`],
          })
          .then((res: string[]) => {
            req.body.cloudImages.push(res);
          });
      })
    );

    next();
  }
);

const updateProperty: RequestHandler = catchAsyncErrors(
  async (req: ExpressRequestHandler, res: Response, next: NextFunction) => {
    // spread request object into new
    const body = { ...req.body };
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
    let propertyImages: string[] = [];
    await cloudinary.v2.api.resources(
      {
        type: 'upload',
        prefix: `${property!.title}`, // add your folder
      },
      function (error: Error, result: any) {
        propertyImages.push(result);
      }
    );

    if (!property) {
      return next(new AppError(`Property not found`, 404));
    }
    res.status(200).json({
      property,
      propertyImages,
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

interface ExpressRequestHandler extends Request {
  files: [];
}

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
  uploadPropertyImages,
  resizePropertyImages,
  uploadImagesToCloud,
};
