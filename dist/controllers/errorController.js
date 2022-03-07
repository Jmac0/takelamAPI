"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = (err) => {
    const message = `invalid value ${err.value} for ${err.path} parameter`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    // get field with error from Error object
    const errorField = Object.keys(err.keyPattern)[0];
    const message = `Duplicate field input: '${errorField}' Must have unique value`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    //const message: string = err.message!.replace("Validation failed:", "");
    const messages = Object.values(err.errors).map((el) => el.message).join('. ');
    return new appError_1.default(messages, 400);
};
/// extracted responses into functions for neatness
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    // check if error comes from our appError class and is an expected error
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        /////////////// Handle programing errors ////////////////////
    }
    else {
        // log error to console
        console.error('ERROR :-(', err);
        /// send generic response if programing or unknown error
        res.status(500).json({
            status: 'error',
            message: 'Something is very wrong contact developer',
        });
    }
};
exports.default = (err, req, res, next) => {
    // check for error statuses or assign default values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    //send error message for development or production environments
    if (process.env.NODE_ENV === 'dev') {
        // send dev error
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        // copy error object
        let error = Object.assign(err);
        // handle cast errors
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        // handle duplicate field entry errors
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        // handle validation errors
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        // send production error
        sendErrorProd(error, res);
    }
    next();
};
