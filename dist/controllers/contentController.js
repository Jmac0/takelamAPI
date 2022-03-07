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
exports.updateContent = exports.createContent = exports.getContent = void 0;
const contentModel_1 = __importDefault(require("../models/contentModel"));
const catchAsyncErrors_1 = __importDefault(require("../utils/catchAsyncErrors"));
const appError_1 = __importDefault(require("../utils/appError"));
const getContent = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield contentModel_1.default.find();
    if (content.length === 0) {
        return next(new appError_1.default('Nothing found in database: contact developer', 404));
    }
    res.status(200).json({
        content
    });
}));
exports.getContent = getContent;
const createContent = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newContent = yield contentModel_1.default.create(req.body);
    res.status(201).json({
        status: 'Ok',
        content: newContent,
    });
}));
exports.createContent = createContent;
const updateContent = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const content = yield contentModel_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!content) {
        return next(new appError_1.default('No content found', 404));
    }
    res.status(200).json({
        status: 'ok',
        data: content,
    });
}));
exports.updateContent = updateContent;
