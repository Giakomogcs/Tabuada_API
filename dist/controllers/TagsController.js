"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../utils/AppError"));
const index_1 = __importDefault(require("../database/knex/index"));
class TagsController {
    async create(request, response) {
        const { patrimony, tag_id, description, responsible, last_read, is_active, } = request.body;
        const checkTagExists = await (0, index_1.default)("tags").where({ tag_id });
        if (checkTagExists.length > 0) {
            throw new AppError_1.default("Essa tag já está em uso");
        }
        const checkPatrimonyExists = await (0, index_1.default)("tags").where({ patrimony });
        if (checkPatrimonyExists.length > 0) {
            throw new AppError_1.default("Esse patrimônio já está em uso");
        }
        if (!patrimony || !tag_id) {
            throw new AppError_1.default("Número do patrimônio ou número de Tag é obrigatório");
        }
        const [tag] = await (0, index_1.default)("tags")
            .insert({
            patrimony,
            tag_id,
            description,
            responsible,
            last_read: new Date(),
            is_active,
        })
            .returning("id");
        response.status(201).json({ tag });
    }
    async update(request, response) {
        const { id } = request.params;
        const currentTimestamp = new Date();
        const tag = await (0, index_1.default)("tags").where({ id }).first();
        if (!tag) {
            throw new AppError_1.default("Não foi possível encontrar a tag", 401);
        }
        tag.is_active = !tag.is_active;
        tag.last_read = currentTimestamp;
        await (0, index_1.default)("tags").update(tag).where({ id });
        response.status(200).json(tag);
    }
    async delete(request, response) {
        const { id } = request.params;
        const tag = await (0, index_1.default)("tags").where({ id }).first();
        if (!tag) {
            throw new AppError_1.default("Não foi possível encontrar a tag", 401);
        }
        await (0, index_1.default)("tags").where({ id }).delete();
        response.json("Produto deletado!");
    }
    async index(request, response) {
        let tags = await (0, index_1.default)("tags");
        response.status(200).json(tags);
    }
}
exports.default = TagsController;
