import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
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

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("users");
};
