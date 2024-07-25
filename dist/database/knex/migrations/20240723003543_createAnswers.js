"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => {
    await knex.schema.createTable("answers", (table) => {
        table.increments("id").unsigned().primary();
        table.text("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.text("roomMult");
        table.json("hits");
        table.json("resultIA");
        table.timestamp("created_at");
        table.timestamp("updated_at");
    });
};
exports.up = up;
const down = async (knex) => {
    await knex.schema.dropTable("answers");
};
exports.down = down;
