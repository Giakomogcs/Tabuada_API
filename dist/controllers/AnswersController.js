"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswersController = void 0;
const AppError_1 = __importDefault(require("../utils/AppError"));
const index_1 = __importDefault(require("../database/knex/index"));
class AnswersController {
    async create(request, response) {
        const { id_student, roomMult, hits } = request.body;
        // Verificar se o usuário existe
        const checkUserExists = await (0, index_1.default)("users")
            .where({ id: id_student })
            .first();
        if (!checkUserExists) {
            throw new AppError_1.default("Usuário não existe");
        }
        if (!roomMult) {
            throw new AppError_1.default("Sala de multiplicação é obrigatório");
        }
        if (!hits) {
            throw new AppError_1.default("Perguntas e respostas são obrigatórias");
        }
        const hitsJson = typeof hits === "string" ? hits : JSON.stringify(hits);
        // Inserir a resposta
        const [idAnswer] = await (0, index_1.default)("answers")
            .insert({
            user_id: id_student,
            hits: hitsJson,
            roomMult,
            created_at: new Date(),
            updated_at: new Date(),
        })
            .returning("id");
        // Não é necessário enviar a resposta aqui, pois não estamos lidando com o `response` no contexto do `AnswersController`
        response.status(201).json("Respostas salvas com sucesso.");
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
