import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import env from "@/env";
import { tryCatch } from "@/lib/helpers/trycatch";

import * as schema from "./schema";

const db = drizzle(env.DATABASE_URL, {
	schema
});

const { error: migrationError } = await tryCatch(migrate(db, { migrationsFolder: "./drizzle" }));
if (migrationError) {
	console.error("Database migration failed:", migrationError);
	process.exit(1);
}

export { db };
