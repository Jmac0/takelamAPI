import { NextFunction, Request, RequestHandler, Response } from 'express';
const CryptoJS = require('crypto-js');
import { isPast, isFuture} from 'date-fns';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';
import Property from '../models/propertyModel';

interface LinkObject {
  id: string;
  expires: string;
}

const getPropertyClient: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const key = process.env.LINK_SECRET;
    let link = (req.params as { link: string }).link;
    // decode + add back any slashes to encrypted link
    const decoded = decodeURIComponent(link);
    // decrypt object back to original
    const bytes = CryptoJS.AES.decrypt(`${decoded}`, `${key}`);
    const linkData: LinkObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // create readable date from object data
    const date = new Date(linkData.expires)
    // check if the date is still in the future
    const active = isFuture(date);
    // const property = await Property.findById(id);

    /*
        if () {
          return next(new AppError(`Property not found`, 404));
        }
    */
    res.status(200).json({
      active
    });
  }
);

export { getPropertyClient };
