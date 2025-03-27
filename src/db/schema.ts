import { pgTable } from "drizzle-orm/pg-core";

export const dumyTable = pgTable("dummy", t => ({
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
}));
