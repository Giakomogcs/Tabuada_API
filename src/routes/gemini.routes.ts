import { Router } from "express";
import GeminiController from "../controllers/GeminiController";

import multer from "multer";

import uploadConfig from "../configs/uploads";

const geminiRoutes = Router();

const geminiController = new GeminiController();

geminiRoutes.post("/analyze", geminiController.analyzeHits);

export default geminiRoutes;
