import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").unsigned().primary();
    table.text("name");
    table.text("email");
    table.text("password");
    table.text("picture");

    table.timestamp("birthday");
    table.timestamp("created_at");
    table.timestamp("updated_at");
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("users");
};
