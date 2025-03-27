import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import env from "@/env";

import * as schema from "./schema";

const db = drizzle(env.DATABASE_URL, {
    schema,
});

await migrate(db, { migrationsFolder: "./drizzle" });

export { db };
