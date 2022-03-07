"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class AppError extends mongoose_1.Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        // set status depending on statusCode
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        // use isOperational to check error origin.
        this.isOperational = true;
        // remove this error from stack trace
        mongoose_1.Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
