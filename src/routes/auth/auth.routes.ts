import { createErrorObjectSchema } from "@/lib/helpers/response-schemas";
import { meResponseSchema, signInSchema, signUpSchema } from "@/schemas/auth.schema";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

const tags = ["Auth"];

export const signup = createRoute({
	path: "/auth/signup",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(signUpSchema, "User info and credentials")
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createErrorObjectSchema("already_authenticated", "You can't do that while signed in"),
			"Already signed in error"
		),
		[HttpStatusCodes.CONFLICT]: jsonContent(
			createErrorObjectSchema("username_taken", "Username is already taken"),
			"Username taken error"
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createErrorObjectSchema("password_weak", "Password is weak"),
			"Password weak error"
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(signUpSchema),
			"Sign up validation error"
		),
		[HttpStatusCodes.OK]: jsonContent(
			z.object({ message: z.literal("Signed up successfully") }),
			"Signed up successfully"
		)
	}
});

export const signin = createRoute({
	path: "/auth/signin",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(signInSchema, "User credentials")
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createErrorObjectSchema("already_authenticated", "You can't do that while signed in"),
			"Already signed in error"
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createErrorObjectSchema("invalid_credentials", "Invalid credentials"),
			"Invalid credentials error"
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(signInSchema),
			"Sign in validation error"
		),
		[HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema("Signed in successfully"), "Signed in successfully")
	}
});

export const me = createRoute({
	path: "/auth/me",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createErrorObjectSchema("unauthorized", "Unauthorized"),
			"Unauthorized error"
		),
		[HttpStatusCodes.OK]: jsonContent(meResponseSchema, "User's session and info")
	}
});

export const signout = createRoute({
	path: "/auth/signout",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			createMessageObjectSchema("Signed out successfully"),
			"Signed out successfully"
		)
	}
});

export type SignupRoute = typeof signup;
export type SigninRoute = typeof signin;
export type MeRoute = typeof me;
export type SingoutRoute = typeof signout;
