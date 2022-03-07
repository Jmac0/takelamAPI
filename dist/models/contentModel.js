"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contentSchema = new mongoose_1.default.Schema({
    componentName: {
        unique: [true, 'Component names must be unique please chose another name'],
        type: String,
        required: [true, 'A component must have a title'],
    },
    path: {
        unique: [true, 'Url path must be unique please chose another name'],
        type: String,
        required: [true, 'A Page must have a URL'],
    },
    heading: {
        type: String,
        required: [true, 'A page must have a heading'],
        minlength: [3, 'A page heading must have more than 3 characters'],
    },
    bodyText: {
        type: String,
        required: [true, 'A page must have some content '],
        minlength: [4, 'Page content must be more than 4 characters long'],
    },
});
const Content = mongoose_1.default.model('Content', contentSchema);
exports.default = Content;
