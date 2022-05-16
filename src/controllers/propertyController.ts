import { NextFunction, Request, RequestHandler, Response } from 'express';
import Property from '../models/propertyModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';
import { isFuture } from 'date-fns';
import { PropertyInterface } from '../interfaces/interfaces';
//const sharp = require('sharp');
const CryptoJS = require('crypto-js');
const cloudinary = require('../utils/cloudinary');
// multer instance and config file
const upload = require('../utils/multer');
// multer method to upload multiple images puts files on req.body.files
const uploadPropertyImages = upload.array('images', 20);

interface ImageRequest extends Request {
  property: PropertyInterface;
  floorplanFiles: {}[];
  floorPlan: string[];
  propertyImages: {}[];
  _id: string;
}
interface ImageFile {
  originalname: string;
  path: string;
}

const uploadFloorPlan: RequestHandler = catchAsyncErrors(
  async (req: ImageRequest, res: Response, next: NextFunction) => {
    const id = (req.params as { id: string }).id;
    const property = await Property.findById(id);
    if (!property)
      return next(new AppError('No property found with that ID', 404));
    req.property = property;
    // check for files on request
    // @ts-ignore

    if (req.files === []) {

      return next();
    }
    // create separate arrays for floor plans and images
    req.floorplanFiles = [];
    req.propertyImages = [];
    // array of urls to images on cloud
    req.body.floorPlan = [];
    // check the image name for floor plan
    const regex = /^floorplan/i;
    // map req array and separate images and floor plans
    // @ts-ignore
    req.files.forEach((image: ImageFile) => {
      if (regex.test(image.originalname)) {
        req.floorplanFiles.push(image);
      } else {
        req.propertyImages.push(image);
      }
    });
    // upload floor plans to sub folder on cloud
    if (req.floorplanFiles.length > 0) {
      await Promise.all(
        // new property on req object for cloudinary responses
        // map over images array and await promises
        req!.floorplanFiles!.map(
          // @ts-ignore
          async (image: ImageFile) => {
            // @ts-ignore
            await cloudinary.uploader
              .upload(image.path, {
                // remove file extension
                public_id: `${image.originalname.replace(/\.[^/.]+$/, '')}`,
                folder: `${property.tag}/floorplan`,
                use_filenames: true,
              })
              .then((res: any) => {
                req.body.floorPlan.push(res.secure_url);
              });
          }
        )
      );
    }

    next();
  }
);

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
  async (req: ImageRequest, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (req.propertyImages.length > 0) {
      await Promise.all(
        // new property on req object for cloudinary responses
        // map over images array and await promises
        // @ts-ignore
        req!.propertyImages!.map(async (image: ImageFile) => {
          // @ts-ignore
          await cloudinary.uploader.upload(image.path, {
            // remove file extension
            public_id: `${image.originalname.replace(/\.[^/.]+$/, '')}`,
            folder: `${req.property.tag}`,
            tags: [`${req.property.tag}`],
            use_filenames: true,
          });
        })
      );
    }
    next();
  }
);

const updateProperty: RequestHandler = catchAsyncErrors(
  async (req: ImageRequest, res: Response, next: NextFunction) => {
    // spread request object into new
    const id = req.property._id;
    // convert coords string to an array of numbers and add to body
    if (!req.body.cords)
      return next(new AppError('Please enter coordinates to create map', 400));
    const cords = req.body.cords.split(',').map((el: string) => Number(el));
    let body = { ...req.body, cords };
    console.log(req.body.floorPlan)
    if (body.floorPlan.length === 0)  {
    delete body.floorPlan
      console.log('entered block ')

    }

console.log()
    await Property.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      message: 'Property successfully updated',
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
      message: 'New property created ok',
      content: newProperty,
    });
  }
);

const deleteProperty = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = (req.params as { id: string }).id;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      /*todo delete images from cloud ?*/
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
    // replace any - with % that were added in when the link was created
    const search = /-/gi;
    id = id.replace(search, '%');
    // decode + add back any slashes to encrypted link
    const decoded = decodeURIComponent(id);
    // decrypt object back to original
    const bytes = CryptoJS.AES.decrypt(`${decoded}`, `${key}`);
    const linkData: LinkObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const { propertyId, expires } = linkData;
    // create readable date from object data
    const date = new Date(expires);
    // check if the date is still in the future
    const active = isFuture(date);
    // send link expired message if over seven days old
    if (!active) {
      return res.status(400).json({
        response: 'Link expired please contact us for help',
      });
    }
    // get property
    const property = await Property.findById(propertyId);
    if (!property) {
      return next(new AppError(`Property not found`, 404));
    }
    res.status(200).json({
      property,
    });
  }
);

export {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadFloorPlan,
  uploadPropertyImages,
  //resizePropertyImages,
  uploadImagesToCloud,
  getPropertyClient,
};
