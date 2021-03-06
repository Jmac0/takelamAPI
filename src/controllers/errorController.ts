import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
///// Global error response handler, all app errors end up here
interface Error {
  keyPattern?: {};
  code: number;
  error: string;
  value?: string;
  isOperational?: boolean;
  path?: string;
  name?: string | {};
  statusCode?: number;
  status?: string;
  message?: string | {};
  stack?: string;
  errors?: {};
  keyValue?: {
    aboutTitle?: string;
  };
}

const handleCastErrorDB = (err: Error): AppError => {
  const message = `invalid value ${err.value} for ${err.path} parameter`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err: Error): AppError => {
  // get field with error from Error object
  const errorField = Object.keys(err.keyPattern as {})[0];
  const message = `Duplicate field input: '${errorField}' Must have unique value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err: Error) => {
  //const message: string = err.message!.replace("Validation failed:", "");
  const messages: string = Object.values(err.errors as {})
    .map((el: any) => el.message)
    .join('. ');
  return new AppError(messages, 400);
};

// error for malformed/tampered token
const handleJWTError = () => {
 return  new AppError('Invalid token please login again', 401);
}
const handleJWTExpiredError = () => {

  return new AppError('Token expiered please log in again', 401)
}
/// extracted responses into functions for neatness
const sendErrorDev = (err: Error, res: Response) => {
  res.status(err.statusCode as number).json({
    status: err.status,
    error: err,
    stack: err.stack,
  });
};
const sendErrorProd = (err: AppError, res: Response) => {
  // check if error comes from our appError class and is an expected error
  if (err.isOperational) {
    res.status(err.statusCode as number).json({
      status: err.status,
      message: err.message,
    });
    /////////////// Handle programing errors ////////////////////
  } else {
    // log error to console
    console.error('ERROR :-(', err);
    /// send generic response if programing or unknown error
    res.status(500).json({
      status: 'error',
      message: 'Something is very wrong contact developer',
    });
  }
};

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check for error statuses or assign default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  //send error message for development or production environments
  if (process.env.NODE_ENV === 'dev') {
    // send dev error
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // copy error object
    let error = Object.assign(err);
    // handle cast errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // handle duplicate field entry errors
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // handle validation errors
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    // send production error

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    // send production error
    sendErrorProd(error, res);
  }

  next();
};
