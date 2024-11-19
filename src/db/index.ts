import { config } from "@dotenvx/dotenvx";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({ path: ".env" });

export const client = postgres(process.env.DATABASE_URL, { prepare: false });
//@ts-expect-error TS2345: Argument of type { client: postgres.Sql<{}>; } is not assignable to parameter of type
export const db = drizzle({ client });