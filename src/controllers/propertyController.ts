import { RequestHandler } from 'express';

import { Request, Response, NextFunction } from 'express';
import Property from '../models/propertyModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';

const getAllProperties: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const property = await Property.find();
    if(property.length === 0){
      return next(new AppError('Nothing found in database: contact developer', 404))
    }
    res.status(200).json({
      property
    });

  }

);

const getProperty: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = (req.params as {id: string}).id
    const property = await Property.findById(id);
    if(!property){
      return next(new AppError(`Property not found`, 404))
    }
    res.status(200).json({
      property
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
    const id = (req.params as { id: string }).id;
    const property = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!property){
      return next( new AppError('No content found', 404));
    }


    res.status(200).json({
      status: 'ok',
      data: property,
    });
  }
);

const deleteProperty = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
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
});


export { getAllProperties, getProperty, createProperty, updateProperty, deleteProperty };
