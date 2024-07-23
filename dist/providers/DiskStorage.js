"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const uploads_1 = __importDefault(require("../configs/uploads"));
class DiskStorage {
    async saveFile(file) {
        await promises_1.default.rename(path_1.default.resolve(uploads_1.default.TMP_FOLDER, file), path_1.default.resolve(uploads_1.default.UPLOADS_FOLDER, file));
        return file;
    }
    async deleteFile(file) {
        const filePath = path_1.default.resolve(uploads_1.default.UPLOADS_FOLDER, file);
        try {
            await promises_1.default.stat(filePath);
        }
        catch {
            return;
        }
        await promises_1.default.unlink(filePath);
    }
}
exports.default = DiskStorage;
