"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const contentRouter_1 = __importDefault(require("./routers/contentRouter"));
const propertyRouter_1 = __importDefault(require("./routers/propertyRouter"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
}
//Set Cross origin policy
app.use((0, cors_1.default)());
app.use(express_1.default.json({
    limit: '10kb',
}));
app.use('/api/v1/content', contentRouter_1.default);
app.use('/api/v1/properties', propertyRouter_1.default);
//////// Handle undefined routes on all http methods /////////////
app.all('*', (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(errorController_1.default);
exports.default = app;
