"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsyncErrors = (fn) => {
    return (req, res, next) => {
        // fn is now our async function waiting to be called by express
        fn(req, res, next).catch((err) => next(err));
    };
};
exports.default = catchAsyncErrors;
