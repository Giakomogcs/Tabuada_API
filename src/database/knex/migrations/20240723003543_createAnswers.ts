import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("answers", (table) => {
    table.text("id").unsigned().primary();
    table.text("user_id").references("id").inTable("users").onDelete("CASCADE");

    table.json("hits");

    table.timestamp("created_at");
    table.timestamp("updated_at");
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("answers");
};
