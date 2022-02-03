import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';

const catchAsyncErrors = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // fn is now our async function waiting to be called by express
    fn(req, res, next).catch((err: Error) => next(err));
  };
};

export default catchAsyncErrors;
