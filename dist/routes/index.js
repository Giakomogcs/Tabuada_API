"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./users.routes"));
const answers_routes_1 = __importDefault(require("./answers.routes"));
const gemini_routes_1 = __importDefault(require("./gemini.routes"));
const routes = (0, express_1.Router)();
routes.use("/api/users", users_routes_1.default);
routes.use("/api/answers", answers_routes_1.default);
routes.use("/api/gemini", gemini_routes_1.default);
exports.default = routes;
