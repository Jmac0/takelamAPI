import { RequestHandler } from 'express';

import { Request, Response, NextFunction } from 'express';
import Content from '../models/contentModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';
import AppError from '../utils/appError';

const getContent: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const content = await Content.find();
    if (content.length === 0) {
      return next(
        new AppError('Nothing found in database: contact developer', 404)
      );
    }
    res.status(200).json({
      content,
    });
  }
);

const createContent: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const newContent = await Content.create(req.body);

    res.status(201).json({
      status: 'Ok',
      content: newContent,
    });
  }
);

const updateContent: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = (req.params as { id: string }).id;
    const content = await Content.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!content) {
      return next(new AppError('No content found', 404));
    }

    res.status(200).json({
      status: 'ok',
      message: 'Page successfully updated',
      data: content,
    });
  }
);

export { getContent, createContent, updateContent };
