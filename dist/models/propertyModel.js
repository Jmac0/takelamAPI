"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const propertySchema = new mongoose_1.default.Schema({
    title: {
        unique: [true, 'Property names must be unique please chose another name'],
        type: String,
        required: [true, 'A property must have a title'],
    },
    description: {
        type: String,
        required: [true, 'A property must have a description'],
        minlength: [10, 'A description must have more than 10 characters'],
    },
    ownership: {
        type: String,
        required: [true, 'A property must have ownership details'],
    },
    plotSize: {
        type: String,
        required: [true, 'A property must have a plot size '],
    },
    buildSize: {
        type: Number,
        required: [true, 'A property must have a build size'],
    },
    bedrooms: {
        type: Number,
    },
    bathrooms: {
        type: Number,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    /*google geo data? */
    map: String,
    images: [String],
    floorPlan: [String],
});
const Property = mongoose_1.default.model('Property', propertySchema);
exports.default = Property;
