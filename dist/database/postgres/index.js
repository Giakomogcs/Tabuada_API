"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const path_1 = __importDefault(require("path"));
function postgresConnection() {
    return (0, knex_1.default)({
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            tableName: "knex_migrations",
            directory: path_1.default.resolve(__dirname, "src", "database", "knex", "migrations"),
        },
    });
}
exports.default = postgresConnection;
