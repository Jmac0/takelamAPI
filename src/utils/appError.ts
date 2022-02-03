import { Error } from 'mongoose';

class AppError extends Error {
  public status: string;
  public isOperational: boolean;
  constructor(public message: string, public statusCode: number) {
    super(message);
    // set status depending on statusCode
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    // use isOperational to check error origin.
    this.isOperational = true;

    // remove this error from stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
