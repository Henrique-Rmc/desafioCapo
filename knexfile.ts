import type { Knex } from "knex";

const config: Knex.Config = {
    client: "mysql2",
    connection: {
        host: process.env.MYSQL_HOST || "localhost",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "0102",
        database: process.env.MYSQL_DATABASE || "flights",
    },
    migrations: {
        directory: "./migrations",
    },
    seeds: {
        directory: "./seeds",
    },
};

export default config;
