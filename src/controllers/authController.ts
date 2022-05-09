const crypto = require('crypto');
const { promisify } = require('util');
import { NextFunction, Request, Response } from 'express';
import { addDays, endOfDay } from 'date-fns';
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
import User from '../models/userModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';
import baseUrl from '../utils/baseURL';
import { ObjectId } from 'mongodb';
import sendEmail from '../utils/email';

interface User {
  _id: ObjectId;
  passwordResetExpires: Date | undefined;
  password: string | undefined;
}

interface UserRequest extends Request {
  user: User;
}
// const cookieExpires = process.env.JWT_COOKIE_EXPIRES;

const signToken = (id: ObjectId) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// set options for cookies
/*
const cookieOptions = {
  expires: new Date(Date.now() + Number(cookieExpires) * 24 * 60 * 60 * 1000),
  secure: true,
  sameSite: 'Secure',
  httpOnly: true,
};
*/

// create and send JWT
const createAndSendToken = (user: User, statusCode: number, res: Response, message ='') => {
  user.password = undefined;
  const token = signToken(user._id as ObjectId);
  // create cookie
  res.cookie('_taklam', token, { sameSite: 'none', secure: true, domain: 'takelamapi.com' });
  return res.status(statusCode).json({
    status: 'success',
    message,
    token,
    user,
  });
};

const createAdmin = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const newAdmin = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });

    createAndSendToken(newAdmin, 201, res);
  }
);

const loginAdmin = catchAsyncErrors(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    //  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    const email = (req.body as { email: string }).email;
    const password = (req.body as { password: string }).password;

    // check for email and password
    if (!email || !password) {
      return next(new AppError('Email & password required!', 400));
    }
    // find user and add password to the selected data from db
    const user = await User.findOne({ email }).select('+password');
    // check user exists also Type-checks user is not undefined
    if (!user)
      return next(new AppError('Username or password incorrect!', 401));
    // check password is correct, method in userModel
    const correctPw = await user.correctPassword(password, user.password);
    if (!correctPw)
      return next(new AppError('Username or password incorrect!', 401));
    createAndSendToken(user, 200, res);
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
  async (req: UserRequest, res: Response, next: NextFunction) => {
    // get token from headers
    let token;
    const authorization = (req.cookies as { authorization: string })
      .authorization;
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    } else if (req.cookies._taklam) {
      token = req.cookies._taklam;
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
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser)
      return next(new AppError('User with this token not found!', 401));

    // check if user changed passwords, compare date in db with decoded JWT iat
    const tokenActive = await currentUser.passwordChangedAfter(decoded.iat);
    if (tokenActive)
      return next(new AppError('User recently changed passwords please log in again', 401));
    req.user = currentUser;
    next();
  }
);

const updateUser = catchAsyncErrors(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const passwordCurrent = (req.body as { passwordCurrent: string }).passwordCurrent;

    const user = await User.findOne(req.user._id).select('+password');
    if (!user) return next(new AppError('User not found', 401));

    const correctPw = await user!.correctPassword(
      passwordCurrent,
      user!.password
    );

    if (!correctPw) {
      return next(new AppError('password incorrect', 401));
    }

    if (req.body.password) user!.password = req.body.password;
    user!.passwordConfirm = req.body.passwordConfirm;

    if (req.body.email) user!.email = req.body.email;

    await user!.save({validateBeforeSave: false});
const message = 'Your user info was updated'
    createAndSendToken(user, 200, res, message );
  }
);

const forgotPassword = catchAsyncErrors(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    // get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('No user found with that email found', 404));
    // generate random token
    const resetToken = await user.createResetToken();
    // stops express asking for password
    await user.save({ validateBeforeSave: false });

    const resetLink = `${baseUrl}/users/resetpassword/${resetToken}`;

    try {
      // send token to user using node mailer
      await sendEmail({
        email: req.body.email,
        subject: 'Reset password, link (valid for 10 minutes)',
        html: `<p>TAKELAM</p>
<p>Click <a href=${resetLink}>here</a> to reset your password, 
if you did not request this email please delete it! </p>`,
      });
    } catch (e) {
      console.log(e)
      // if error delete token in db and expires time
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      // turn off validators and throw error
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was a problem sending the email, please try again later.',
          500
        )
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email',
      resetLink
    });
  }
);

const resetPassword = catchAsyncErrors(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    // get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    // find user and check if token has expired, will not return a user if token is expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
      return next(new AppError('Token is invalid or has expired', 400));
    // update password changed at property in db
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    // delete fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // save will run middleware
    await user.save();
    // log user in with jwt
  //  createAndSendToken(user, 200, res);
    res.status(200).json({
      status: 'success',
      message: 'Password has been reset',
    });
  }
);

export {
  protect,
  createSecureLink,
  createAdmin,
  loginAdmin,
  updateUser,
  forgotPassword,
  resetPassword,
};
