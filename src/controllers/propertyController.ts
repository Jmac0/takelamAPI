import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express';
const sharp = require('sharp');
const  CryptoJS = require("crypto-js");
const cloudinary = require('../utils/cloudinary');
// multer instance and config file
const upload = require('../utils/multer');
import Property from '../models/propertyModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';
import { Error } from 'mongoose';
import { isFuture } from 'date-fns';
// multer method to upload multiple images puts files on req.body.files
const uploadPropertyImages = upload.array('images', 20);
// resize property images for gallery
/*
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
        await sharp(req!.files[i].path).resize(200, 200);req.body.images.push({ path: image.path, original: image.originalname });
      })
    );
    console.log(req.files);

    next();
  }
);
*/
// uploads multiple images to cloudinary server
const uploadImagesToCloud: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // get property name for cloudinary folder
    const id = (req.params as { id: string }).id;
    const property = await Property.findById(id);
    if (!property) return new AppError('No property found', 404);
    if (req.files as []) {
       await Promise.all(
        // new property on req object for cloudinary responses
        // map over images array and await promises
        // @ts-ignore
        req!.files!.map(
          async (image: { originalname: string; path: string }) => {
            // @ts-ignore
          await cloudinary.uploader.upload(image.path, {
              // remove file extension
              public_id: `${image.originalname.replace(/\.[^/.]+$/, '')}`,
              folder: `${property.tag}`,
              tags: [`${property.tag}`],
              use_filenames: true,
            });
          }
        )
      );

    }
    next();
  }
);

const updateProperty: RequestHandler = catchAsyncErrors(
  async (req: ExpressRequestHandler, res: Response, next: NextFunction) => {
    // spread request object into new
    const id = (req.params as { id: string }).id;
    // convert coords string to an array of numbers and add to body
    if(!req.body.cords)  return next(new AppError('Please enter coordinates to create map', 400))
    const cords = req.body.cords.split(',').map((el: string) => Number(el));
      const body = { ...req.body, cords };

    const property = await Property.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return next(new AppError('No content found', 404));
    }

    res.status(204).json({
      status: 'ok',
    });
  }
);

const getAllProperties: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const properties = await Property.find();
    if (properties.length === 0) {
      return next(
        new AppError('Nothing found in database: contact developer', 404)
      );
    }
    res.status(200).json({
      properties,
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
    // convert coords string to an array of numbers and add to body
    const cords = req.body.cords.split(',').map((el: string) => Number(el));
    const body = { ...req.body, cords };
    const newProperty = await Property.create(body);

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
      /*todo delete images from cloud*/
      // return early and call next with an argument = go to error handler
      return next(new AppError(`Property: ${id} not found `, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);


interface LinkObject {
  propertyId: string;
  expires: string;
}



const getPropertyClient: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const key = process.env.LINK_SECRET;
    let id = (req.params as { id: string }).id;
    // decode + add back any slashes to encrypted link
    const decoded = decodeURIComponent(id);
    // decrypt object back to original
    const bytes = CryptoJS.AES.decrypt(`${decoded}`, `${key}`);
    const linkData: LinkObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const {propertyId, expires}  = linkData
    // create readable date from object data
    const date = new Date(expires)
    // check if the date is still in the future
    const active = isFuture(date);
    // send link expired message if over seven days old
    if(!active) {
      res.status(400).json({
        response: 'Link expired please contact us for help',
      });
    }
    // get property
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(new AppError(`Property not found`, 404));
    }
    res.status(200).json({
      property
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
  //resizePropertyImages,
  uploadImagesToCloud,
  getPropertyClient
};
