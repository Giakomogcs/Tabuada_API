"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GeminiController_1 = __importDefault(require("../controllers/GeminiController"));
const geminiRoutes = (0, express_1.Router)();
const geminiController = new GeminiController_1.default();
geminiRoutes.post("/analyze", geminiController.analyzeHits);
exports.default = geminiRoutes;
