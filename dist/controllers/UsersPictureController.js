"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("../database/knex"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const DiskStorage_1 = __importDefault(require("../providers/DiskStorage"));
class UsersPictureController {
    async update(request, response) {
        try {
            const user_id = request.user?.id;
            const pictureFilename = request.file?.filename;
            if (!user_id || !pictureFilename) {
                throw new AppError_1.default("Usuário ou nome do arquivo do picture não encontrado", 400);
            }
            const diskStorage = new DiskStorage_1.default();
            const user = await (0, knex_1.default)("users").where({ id: user_id }).first();
            if (!user) {
                throw new AppError_1.default("Usuário não encontrado", 401);
            }
            if (user.picture) {
                await diskStorage.deleteFile(user.picture);
            }
            const filename = await diskStorage.saveFile(pictureFilename);
            user.picture = filename;
            await (0, knex_1.default)("users").update(user).where({ id: user_id });
            response.json(user);
        }
        catch (error) {
            console.error(error);
            response
                .status(error.statusCode || 500)
                .json({ error: error.message || "Erro interno do servidor" });
        }
    }
}
exports.default = UsersPictureController;
