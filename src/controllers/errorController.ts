import { NextFunction, Request, Response } from 'express';
///// Global error response handler, all app errors end up here 
interface Error{
  statusCode?: number;
  status?: string;
  message?: string;
}

export default (err: Error, req: Request, res:Response, next:NextFunction) => {
// check for error statuses or assign values
  err.statusCode  = err.statusCode || 500;
  err.status = err.status || 'error';
//send error message
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message

  })
next();
}