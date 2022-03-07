"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getProperty = exports.getAllProperties = void 0;
const propertyModel_1 = __importDefault(require("../models/propertyModel"));
const catchAsyncErrors_1 = __importDefault(require("../utils/catchAsyncErrors"));
const appError_1 = __importDefault(require("../utils/appError"));
const getAllProperties = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const property = yield propertyModel_1.default.find();
    if (property.length === 0) {
        return next(new appError_1.default('Nothing found in database: contact developer', 404));
    }
    res.status(200).json({
        property
    });
}));
exports.getAllProperties = getAllProperties;
const getProperty = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const property = yield propertyModel_1.default.findById(id);
    if (!property) {
        return next(new appError_1.default(`Property not found`, 404));
    }
    res.status(200).json({
        property
    });
}));
exports.getProperty = getProperty;
const createProperty = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newProperty = yield propertyModel_1.default.create(req.body);
    res.status(201).json({
        status: 'Ok',
        content: newProperty,
    });
}));
exports.createProperty = createProperty;
const updateProperty = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const property = yield propertyModel_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!property) {
        return next(new appError_1.default('No content found', 404));
    }
    res.status(200).json({
        status: 'ok',
        data: property,
    });
}));
exports.updateProperty = updateProperty;
const deleteProperty = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const property = yield propertyModel_1.default.findByIdAndDelete(id);
    if (!property) {
        // return early and call next with a argument = go to error handler
        // return early and call next with a argument = go to error handler
        return next(new appError_1.default(`Property: ${id} not found `, 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
}));
exports.deleteProperty = deleteProperty;
