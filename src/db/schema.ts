import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const roleEnum = pgEnum("role", ["student", "teacher"]);

export const usersTable = pgTable("users", t => ({
    id: t.text("id").primaryKey().$defaultFn(() => nanoid()),
    username: t.varchar("username", { length: 255 }).unique().notNull(),
    displayName: t.varchar("display_name", { length: 255 }).notNull(),
    passwordHash: t.varchar("password_hash", { length: 255 }),
    role: roleEnum("role").default("student").notNull(),
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
    updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
}));

export const sessionsTable = pgTable("sessions", t => ({
    id: t.text("id").primaryKey().$defaultFn(() => nanoid()),
    token: t.varchar("token", { length: 255 }).unique().notNull(),
    userId: t.text("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: t.timestamp("created_at").defaultNow().notNull(),
    expiresAt: t.timestamp("expires_at").notNull(),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
    sessions: many(sessionsTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userId],
        references: [usersTable.id],
    }),
}));
