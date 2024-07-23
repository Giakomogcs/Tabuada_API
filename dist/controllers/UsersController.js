"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const index_1 = __importDefault(require("../database/knex/index"));
class UsersController {
    async create(request, response) {
        let { name, class_id, age, id_student, roomMult, hits, picture } = request.body;
        const currentTimestamp = new Date();
        if (!id_student) {
            throw new AppError_1.default("Id é obrigatório");
        }
        // Verificar se o usuário existe
        const checkUserExists = await (0, index_1.default)("users")
            .where({ id: id_student })
            .first();
        if (checkUserExists) {
            throw new AppError_1.default("Usuário já existe");
        }
        try {
            const [user] = await (0, index_1.default)("users")
                .insert({
                id: id_student,
                name,
                class_id,
                age,
                created_at: currentTimestamp,
                updated_at: currentTimestamp,
                picture,
            })
                .returning("id");
            await createFirstAnswer({
                id_student,
                roomMult,
                hits,
            });
            response.status(201).json("Usuário e respostas salvas com sucesso.");
        }
        catch (error) {
            console.error(error);
            response.status(500).json({ error: "Internal Server Error" });
        }
    }
    async update(request, response) {
        //const user_id = request.user?.id;
        const { id } = request.params;
        const currentTimestamp = new Date();
        const { name, class_id, age, picture } = request.body;
        const user = await (0, index_1.default)("users").where({ id }).first();
        if (!user) {
            throw new AppError_1.default("Não foi possível encontrar o usuário", 401);
        }
        user.name = name ?? user.name;
        user.class_id = class_id ?? user.class_id;
        user.age = age ?? user.age;
        user.picture = picture ?? user.picture;
        user.updated_at = currentTimestamp;
        await (0, index_1.default)("users").update(user).where({ id });
        response.status(200).json(user);
    }
    async delete(request, response) {
        const { id } = request.params;
        const user = await (0, index_1.default)("users").where({ id }).first();
        if (!user) {
            throw new AppError_1.default("Não foi possível encontrar o user", 401);
        }
        await (0, index_1.default)("users").where({ id }).delete();
        response.json("Usuário deletado!");
    }
    async index(request, response) {
        let user = await (0, index_1.default)("users");
        response.status(200).json(user);
    }
    async show(request, response) {
        const { id } = request.params;
        let user = await (0, index_1.default)("users").where(id).first();
        response.status(200).json(user);
    }
}
async function createFirstAnswer(data) {
    const { id_student, roomMult, hits } = data;
    // Verificar se o usuário existe
    const checkUserExists = await (0, index_1.default)("users").where({ id: id_student }).first();
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
    return { idAnswer };
}
exports.default = UsersController;
