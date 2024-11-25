import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen";
import { config } from "@dotenvx/dotenvx";
import pg from "pg";

const { Pool } = pg;

config({ path: "../../.env" });

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
});
