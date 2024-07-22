import path from "path";
import dotenv from "dotenv";

dotenv.config();

module.exports = {
  development: {
    client: "cockroachdb",
    connection: process.env.DATABASE_URL,

    pool: {
      afterCreate: (conn: any, cb: any) => {
        conn.query("SET timezone='UTC'", (err: any) => {
          if (err) {
            cb(err, conn);
          } else {
            conn.query(
              'SET serial_normalization = "sql_sequence";',
              (err: any) => {
                if (err) {
                  cb(err, conn);
                } else {
                  conn.query("SET default_int_size = 4;", (err: any) => {
                    cb(err, conn);
                  });
                }
              }
            );
          }
        });
      },
    },

    migrations: {
      directory: path.resolve(
        __dirname,
        "src",
        "database",
        "knex",
        "migrations"
      ),
      tableName: "knex_migrations",
    },
    useNullAsDefault: true,
    formatting: { capSQL: true },
  },
};
