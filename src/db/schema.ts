import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const roleEnum = pgEnum("role", ["student", "teacher"]);

export const specialtyEnum = pgEnum("specialty", ["L3 SI", "L3 ISIL", "M2 SIGL", "M2 IA", "M2 RTIC", "M2 IDO"]);

export const usersTable = pgTable("users", (t) => ({
	id: t.text("id").primaryKey().$defaultFn(() => nanoid()),
	username: t.text("username").unique().notNull(),
	displayName: t.text("display_name").notNull(),
	passwordHash: t.text("password_hash"),
	role: roleEnum("role").default("student").notNull(),
	createdAt: t.timestamp("created_at").defaultNow().notNull(),
	updatedAt: t.timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
}));

export const sessionsTable = pgTable("sessions", (t) => ({
	id: t.text("id").primaryKey().$defaultFn(() => nanoid()),
	token: t.text("token").unique().notNull(),
	userId: t.text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
	createdAt: t.timestamp("created_at").defaultNow().notNull(),
	expiresAt: t.timestamp("expires_at").notNull()
}));

export const teacherTable = pgTable("teachers", (t) => ({
	id: t.text("id").primaryKey().$defaultFn(() => nanoid()),
	userId: t.text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
	createdAt: t.timestamp("created_at").defaultNow().notNull(),
	updatedAt: t.timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
}));

export const projectsTable = pgTable("projects", (t) => ({
	id: t.text("id").primaryKey().$defaultFn(() => nanoid()),
	title: t.text("title").notNull(),
	description: t.text("description").notNull(),
	author: t.text("author").notNull().references(() => teacherTable.id, { onDelete: "cascade" }),
	specialty: specialtyEnum("specialty").notNull(),
	category: t.text("category").notNull(),
	createdAt: t.timestamp("created_at").defaultNow().notNull(),
	updatedAt: t.timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
}));

export const usersRelations = relations(usersTable, ({ many, one }) => ({
	sessions: many(sessionsTable),
	teacherInfo: one(teacherTable),
	projects: many(projectsTable)
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id]
	})
}));

export const teacherRelations = relations(teacherTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [teacherTable.userId],
		references: [usersTable.id]
	})
}));

export const projectsRelations = relations(projectsTable, ({ one }) => ({
	teacher: one(teacherTable, {
		fields: [projectsTable.author],
		references: [teacherTable.id]
	})
}));
