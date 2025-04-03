import type { InferSelectModel } from 'drizzle-orm';

import type * as schema from './schema';

export type DatabaseSchema = typeof schema;

export type User = InferSelectModel<DatabaseSchema['usersTable']>;
export type UserWithoutPassword = Omit<User, 'passwordHash'>;

export type Session = InferSelectModel<DatabaseSchema['sessionsTable']>;
