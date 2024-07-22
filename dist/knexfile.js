"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
module.exports = {
    development: {
        client: "cockroachdb",
        connection: process.env.DATABASE_URL,
        pool: {
            afterCreate: (conn, cb) => {
                conn.query("SET timezone='UTC'", (err) => {
                    if (err) {
                        cb(err, conn);
                    }
                    else {
                        conn.query('SET serial_normalization = "sql_sequence";', (err) => {
                            if (err) {
                                cb(err, conn);
                            }
                            else {
                                conn.query("SET default_int_size = 4;", (err) => {
                                    cb(err, conn);
                                });
                            }
                        });
                    }
                });
            },
        },
        migrations: {
            directory: path_1.default.resolve(__dirname, "src", "database", "knex", "migrations"),
        },
        useNullAsDefault: true,
        formatting: { capSQL: true },
    },
};
