"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const geminiAnalyzerGoal_1 = require("../service/geminiAnalyzerGoal");
const index_1 = __importDefault(require("../database/knex/index"));
class GeminiController {
    async analyzeHits(request, response) {
        try {
            const StudentData = request.body;
            const user_id = StudentData.id_student;
            const user = await (0, index_1.default)("users").where({ id: user_id }).first();
            if (!StudentData || !user_id || !user) {
                throw new AppError_1.default("Missing student data or user id.");
            }
            const analyzedGoal = await (0, geminiAnalyzerGoal_1.analyzeHitsWithGemini)({ StudentData });
            response.status(201).json(analyzedGoal);
        }
        catch (error) {
            if (error instanceof AppError_1.default) {
                response.status(400).json({ error: error.message });
            }
            else {
                console.error(error);
                response.status(500).json({ error: "Internal server error" });
            }
        }
    }
    async resultIA(StudentData) {
        try {
            const analyzedGoal = await (0, geminiAnalyzerGoal_1.analyzeHitsWithGemini)({ StudentData });
            return analyzedGoal;
        }
        catch (error) {
            console.error("Erro ao processar resultIA:", error);
            throw new Error("Erro ao processar análise do objetivo.");
        }
    }
}
exports.default = GeminiController;
