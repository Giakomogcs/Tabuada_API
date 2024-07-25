"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswersController = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
const index_1 = __importDefault(require("../database/knex/index"));
const GeminiController_1 = __importDefault(require("./GeminiController"));
const UsersController_1 = __importDefault(require("./UsersController"));
const geminiAnalyzerGoal_1 = require("../service/geminiAnalyzerGoal");
class AnswersController {
    async create(request, response) {
        try {
            const { name, class_id, age, id_student, roomMult, hits, picture } = request.body;
            const geminiController = new GeminiController_1.default();
            const usersController = new UsersController_1.default();
            // Verificar se o usuário existe
            const checkUserExists = await (0, index_1.default)("users")
                .where({ id: id_student })
                .first();
            const StudentData = {
                name,
                class_id,
                age,
                id_student,
                roomMult,
                hits,
                picture,
            };
            if (!checkUserExists) {
                await usersController.createBeforeFirstAnswer(StudentData);
            }
            if (!roomMult) {
                throw new AppError_1.default("Sala de multiplicação é obrigatório");
            }
            if (!hits) {
                throw new AppError_1.default("Perguntas e respostas são obrigatórias");
            }
            const hitsJson = typeof hits === "string" ? hits : JSON.stringify(hits);
            const customRequest = {
                id_student,
                hits: hitsJson,
                roomMult: roomMult,
            };
            //const analyzedGoal = await geminiController.resultIA(customRequest);
            const analyzedGoal = await (0, geminiAnalyzerGoal_1.analyzeHitsWithGemini)({ customRequest });
            // Criar a resposta para enviar ao cliente
            const responsePayload = {
                id_student,
                roomMult,
                resultIA: analyzedGoal.resultIA,
                sumary: analyzedGoal.sumary,
            };
            // Salvar no banco de dados e enviar a resposta simultaneamente
            await Promise.all([
                (0, index_1.default)("answers").insert({
                    user_id: id_student,
                    resultIA: analyzedGoal,
                    roomMult,
                    hits: hitsJson,
                    created_at: new Date(),
                    updated_at: new Date(),
                }),
                response.status(201).json(analyzedGoal), // Enviar a resposta ao cliente
            ]);
        }
        catch (error) {
            if (error instanceof AppError_1.default) {
                response.status(400).json({ error: error.message });
            }
            else {
                console.error(error);
                response.status(500).json({ error: "Erro ao salvar respostas." });
            }
        }
    }
    async update(request, response) {
        const { id } = request.params;
        const { id_student, hits } = request.body;
        const currentTimestamp = new Date();
        const answer = await (0, index_1.default)("answers").where({ id }).first();
        if (!answer) {
            throw new AppError_1.default("Não foi possível encontrar a resposta", 401);
        }
        if (!hits) {
            throw new AppError_1.default("É obrigatório fornecer as respostas", 401);
        }
        answer.hits = hits;
        await (0, index_1.default)("tags").update(answer).where({ id });
        response.status(200).json(answer);
    }
    async delete(request, response) {
        const { id } = request.params;
        const answer = await (0, index_1.default)("answers").where({ id }).first();
        if (!answer) {
            throw new AppError_1.default("Não foi possível encontrar a resposta", 401);
        }
        await (0, index_1.default)("answers").where({ id }).delete();
        response.json("Produto deletado!");
    }
    async index(request, response) {
        let answer = await (0, index_1.default)("answers");
        response.status(200).json(answer);
    }
    async show(request, response) {
        const { id } = request.params;
        let answers = await (0, index_1.default)("answers").where({ id });
        response.status(200).json(answers);
    }
}
exports.AnswersController = AnswersController;
