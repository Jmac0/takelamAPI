import { RequestHandler } from 'express';
import Content from '../models/contentModel';
/// todo create async error handler

const getContent: RequestHandler = async (req, res, next) => {
  // dummy response
  const content = await Content.find();
  res.status(200).json({
    data: content,
  });

  next();
};

const createContent: RequestHandler = async (req, res, next) => {
  const newContent = await Content.create(req.body);

  res.status(201).json({
    status: 'Ok',
    data: {
      content: newContent,
    },
  });
  next();
};

export { getContent, createContent };
