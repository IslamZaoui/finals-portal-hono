import { sessionsTable, usersTable } from "@/db/schema";
import { usersWithoutPasswordView } from "@/db/views";
import { schemaFactory } from "@/lib/factory";
import { z } from "@hono/zod-openapi";

const username = z
	.string({ required_error: "Username is required" })
	.min(3, "Username must be at least 3 characters long")
	.max(20, "Username must be at most 20 characters long")
	.trim();

const displayName = z
	.string({ required_error: "Display name is required" })
	.min(3, "Display name must be at least 3 characters long")
	.max(70, "Display name must be at most 70 characters long")
	.trim();

const role = z.enum(["student", "teacher"], { required_error: "Role is required" });

const password = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.max(255, "Password must be at most 255 characters long");

export const signUpSchema = z
	.object({
		username,
		displayName,
		role,
		password,
		confirmPassword: z.string({ required_error: "Password confirmation is required" })
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({ code: "custom", message: "Passwords do not match", path: ["confirmPassword"] });
		}
	});

export const signInSchema = z.object({
	username,
	password: z.string({ required_error: "Password is required" })
});

export const sessionSchema = schemaFactory.createSelectSchema(sessionsTable);
export const userSchema = schemaFactory.createSelectSchema(usersTable);
export const userWithoutPasswordSchema = schemaFactory.createSelectSchema(usersWithoutPasswordView);

export const userSessionSchema = z.object({
	...sessionSchema.shape,
	user: userWithoutPasswordSchema
});
