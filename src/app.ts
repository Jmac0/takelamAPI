import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import contentRouter from './routers/contentRouter';
import propertyRouter from './routers/propertyRouter';
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
//////// Handle undefined routes on all http methods /////////////
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
