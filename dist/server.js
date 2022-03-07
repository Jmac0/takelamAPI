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
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const DB = process.env.DB.replace('<password>', process.env.PASSWORD);
const port = process.env.PORT;
// catch unhandled synchronous errors
process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION 💥 shutting down...');
    process.exit(1);
});
// connect to Mongo db
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(DB, {});
            console.log('Database connected');
        }
        catch (err) {
            console.log(err);
        }
    });
})();
// connect to server
const server = app_1.default.listen(port, () => {
    if (process.env.NODE_ENV === 'dev') {
        console.log('Development Server Started');
    }
    else {
        console.log('Production Server Started');
    }
});
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION 💥 Shutting down...');
    // shut down node app
    // gracefully shutdown
    server.close(() => {
        process.exit(1);
    });
});
