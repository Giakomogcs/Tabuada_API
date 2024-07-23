"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => {
    await knex.schema.createTable("users", (table) => {
        table.text("id").unsigned().primary();
        table.text("name");
        table.text("picture");
        table.text("class_id");
        table.text("age");
        table.timestamp("created_at");
        table.timestamp("updated_at");
    });
};
exports.up = up;
const down = async (knex) => {
    await knex.schema.dropTable("users");
};
exports.down = down;
