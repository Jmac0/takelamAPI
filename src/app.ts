import 'dotenv/config';
const helmet = require('helmet');
const hpp = require('hpp');
import express from 'express';
const rateLimit = require('express-rate-limit');
import cors from 'cors';
import morgan from 'morgan';
const cookieParser = require('cookie-parser');
const mongoSanitizer = require('express-mongo-sanitize');
import contentRouter from './routers/contentRouter';
import propertyRouter from './routers/propertyRouter';
import refreshLoginRouter from './routers/refreshLoginRouter';
import authRouter from './routers/authRouter';
import linkRouter from './routers/authRouter';
// import clientRouter from './routers/clientRouter';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
require('dotenv').config();
const app = express();
app.enable('trust proxy')

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(helmet());
const coresOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
  'Access-Control-Allow-Credentials': 'true',
};

//Set Cross origin policy
app.use(cors(coresOptions));
app.use(
  express.json({
    limit: '10kb',
  })
);
// @ts-ignore
app.options('*', cors())
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(mongoSanitizer());
app.use(hpp());



//app.use('/api/v1/auth',(req: Request, res: Response, next: NextFunction) => {

//res.status(123)
//  next();
//})

// for persistent login
app.use('/api/v1/auth', refreshLoginRouter);
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
