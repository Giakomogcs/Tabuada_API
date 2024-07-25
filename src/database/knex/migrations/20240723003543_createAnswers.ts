import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
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

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("answers");
};
