import { config } from "@dotenvx/dotenvx";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env" });

if (process.env.DATABASE_URL == null) {
    throw new Error("DATABASE_URL environment variable is missing.");
}

export const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle({ client });