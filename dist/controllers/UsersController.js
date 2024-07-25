"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const index_1 = __importDefault(require("../database/knex/index"));
class UsersController {
    async create(request, response) {
        try {
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
            response.status(201).json("Usuário salvo com sucesso.");
        }
        catch (error) {
            if (error instanceof AppError_1.default) {
                response.status(400).json({ error: error.message });
            }
            else {
                console.error(error);
                response.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
    async createBeforeFirstAnswer(data) {
        try {
            const { name, class_id, age, id_student, roomMult, hits, picture } = data;
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
            return;
        }
        catch (error) {
            console.error(error);
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
exports.default = UsersController;
