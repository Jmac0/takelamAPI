import {RequestHandler} from "express";
// todo import content modle

/// todo create async error handler

const getContent: RequestHandler = async (req, res, next ) => {
// dummy response

    res.status(200).json({
        message: 'Hello from content controller'
    })


    next();
}
export {getContent}