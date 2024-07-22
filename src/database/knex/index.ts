const config = require("../../../knexfile");
require("dotenv").config();

import knex from "knex";

const connection = knex(config.development);
export default connection;
