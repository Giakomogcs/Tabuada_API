"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_1 = __importDefault(require("./utils/AppError"));
const postgres_1 = __importDefault(require("./database/postgres"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
(0, postgres_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(routes_1.default);
app.use((error, request, response, next) => {
    if (error instanceof AppError_1.default) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message,
        });
    }
    console.error(error);
    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});
const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
