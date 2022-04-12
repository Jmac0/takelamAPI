const { promisify } = require('util');
import { NextFunction, Request, Response } from 'express';
import { addDays, endOfDay } from 'date-fns';
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
import User from '../models/userModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';
import baseUrl from '../utils/baseURL';

const signToken = (id: string) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createAdmin = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const newAdmin = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newAdmin._id as unknown as string);

    res.status(200).json({
      status: 'success',
      token,
      newAdmin,
    });
  }
);

const loginAdmin = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = (req.body as { email: string }).email;
    const password = (req.body as { password: string }).password;
    // check for email and password
    if (!email || !password) {
      return next(new AppError('Email & password required', 400));
    }
    // find user and add password to the selected data from db
    const user = await User.findOne({ email }).select('+password');
    // check user exists also Type-checks user is not undefined
    if (!user) return next(new AppError('Username or password incorrect', 404));
    // check password is correct, method in userModel
    const correctPw = await user.correctPassword(password, user.password);
    if (!correctPw)
      return next(new AppError('Username or password incorrect', 404));

    const token = signToken(user._id as unknown as string);
    res.status(200).json({
      token,
    });
  }
);

// create link with encrypted
const createSecureLink = catchAsyncErrors(
  async (req: Request, res: Response) => {
    // secret key to for encrypting and decrypting link
    const key = process.env.LINK_SECRET;
    // get property id from req. params
    const id = (req.params as { id: string }).id;
    // create new date object
    const date = new Date();

    // add 7 days to current date creating the expiry date of link
    const dateWithDaysAdded = addDays(date, 7);
    // get end of expires date 11:59 pm
    const expires = endOfDay(dateWithDaysAdded);
    // create object from date and property id
    const dataObject = { propertyId: id, expires: expires };
    // encrypt object
    let encryptData = CryptoJS.AES.encrypt(
      JSON.stringify(dataObject),
      `${key}`
    ).toString();
    // Remove slashes form encrypted string, so it works in the url
    encryptData = encodeURIComponent(encryptData);
    // create client link
    const link = `${baseUrl}/property/view/${encryptData}`;
    res.status(200).json({
      link,
    });
  }
);

const protect = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    // get token from headers
    let token;
    const authorization = (req.headers as { authorization: string })
      .authorization;
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    }
    // check if token exists
    if (!token)
      return next(
        new AppError(
          'You are not logged in, please log in to view this page',
          401
        )
      );
    // validate token promisify is from Node utils
    const decoded = await promisify(jwt.verify)(
      token, process.env.JWT_SECRET
    );
    console.log(decoded);

    // check if user exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) return next(new AppError('User with this token not found', 401));
    // check if user changed passwords, compare date in db with decoded JWT iat
   const tokenActive = await currentUser.passwordChangedAfter(decoded.iat)
console.log(tokenActive);
    next();
  }
);

export { protect, createSecureLink, createAdmin, loginAdmin };
