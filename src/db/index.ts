import path from 'node:path';

import env from '@/env';
import { tryCatch } from '@/lib/helpers/trycatch';
import { drizzle } from 'drizzle-orm/bun-sql';
import { migrate } from 'drizzle-orm/bun-sql/migrator';

import * as schema from './schema';

const db = drizzle(env.DATABASE_URL, {
	schema
});

const { error: migrationError } = await tryCatch(
	migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') })
);
if (migrationError) {
	console.error('Database migration failed:', migrationError);
	process.exit(1);
}

export { db };
