import { Request, Response } from 'express';
import {addDays, endOfDay} from 'date-fns'
const  CryptoJS = require("crypto-js");
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
import Property from '../models/propertyModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';

// create link with encrypted
const createSecureLink = catchAsyncErrors(async (req: Request, res: Response) => {
// secret key to for encrypting and decrypting link
const key =  process.env.LINK_SECRET
// get property id from req. params
  const id = (req.params  as {id: string}).id;
// create new date object
  const date = new Date();
// add 7 days to current date creating the expiry date of link
const dateWithDaysAdded = addDays(date, 7);
// get end of expires date 11:59 pm
const expires = endOfDay(dateWithDaysAdded);
// create object from date and property id
const dataObject = {id: id,  expires: expires};
// encrypt object
let  encryptData = CryptoJS.AES.encrypt(JSON.stringify(dataObject), `${key}`).toString();
// Remove slashes form encrypted string, so it works in the url
encryptData = encodeURIComponent(encryptData);
// create client link
const link = `http://localhost:3000/${encryptData}`
  res.status(200).json({
    link
  })
})

export {createSecureLink}