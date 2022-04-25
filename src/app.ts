import 'dotenv/config';
import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import morgan from 'morgan';
import contentRouter from './routers/contentRouter';
import propertyRouter from './routers/propertyRouter';
import authRouter from "./routers/authRouter";
import linkRouter from './routers/authRouter';
// import clientRouter from './routers/clientRouter';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
const coresOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
  "Access-Control-Allow-Credentials": "true"
}
//Set Cross origin policy
app.use(cors(coresOptions));
app.use(
  express.json({
    limit: '10kb',
  })
);

// @ts-ignore
/*
app.get('/',(req: Request, res: Response, next: NextFunction) => {

  res.send('Hello')

  next();
})
*/

app.use('/api/v1/content', contentRouter);
app.use('/api/v1/properties', propertyRouter);

app.use('/api/v1/users', authRouter);
// create encoded link from date and property id
app.use('/api/v1/link', linkRouter);
// client router
//app.use('/api/v1/client', clientRouter);
//////// Handle undefined routes on all http methods /////////////
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
