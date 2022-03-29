import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import contentRouter from './routers/contentRouter';
import propertyRouter from './routers/propertyRouter';
import linkRouter from './routers/linkRouter';
import clientRouter from './routers/clientRouter';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

//Set Cross origin policy
app.use(cors());
app.use(
  express.json({
    limit: '10kb',
  })
);

app.use('/api/v1/content', contentRouter);
app.use('/api/v1/properties', propertyRouter);
// create encoded link from date and property id
app.use('/api/v1/link', linkRouter);
// client router
app.use('/api/v1/client', clientRouter);
//////// Handle undefined routes on all http methods /////////////
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
