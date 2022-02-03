import { RequestHandler } from 'express';

import { Request, Response, NextFunction } from 'express';
import Content from '../models/contentModel';
import catchAsyncErrors from '../utils/catchAsyncErrors';

const getContent: RequestHandler = catchAsyncErrors(
  async (req: Request, res: Response) => {
    const content = await Content.find();
    res.status(200).json({
      data: content,
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

    res.status(200).json({
      status: 'ok',
      data: content,
    });
    next()
  }
);

export { getContent, createContent, updateContent };
