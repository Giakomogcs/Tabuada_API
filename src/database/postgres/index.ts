import knex from "knex";
import path from "path";

function postgresConnection() {
  return knex({
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: "knex_migrations",
      directory: path.resolve(
        __dirname,
        "src",
        "database",
        "knex",
        "migrations"
      ),
    },
  });
}

export default postgresConnection;
