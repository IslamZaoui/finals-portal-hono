import { meResponseSchema, signInSchema, signUpSchema } from "@/lib/schemas/auth.schema";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

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
			z.object({ code: z.literal("already_signed_in"), message: z.literal("You are already signed in") }),
			"Already signed in error"
		),
		[HttpStatusCodes.CONFLICT]: jsonContent(
			z.object({ code: z.literal("username_taken"), message: z.literal("Username is already taken") }),
			"Username taken error"
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			z.object({ code: z.literal("password_weak"), message: z.literal("Password is weak") }),
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
			z.object({ code: z.literal("already_signed_in"), message: z.literal("You are already signed in") }),
			"Already signed in error"
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			z.object({ code: z.literal("invalid_credentials"), message: z.literal("invalid username or password") }),
			"Invalid credentials error"
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(signInSchema),
			"Sign in validation error"
		),
		[HttpStatusCodes.OK]: jsonContent(
			z.object({ message: z.literal("Signed in successfully") }),
			"Signed in successfully"
		)
	}
});

export const me = createRoute({
	path: "/auth/me",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			z.object({ code: z.literal("unauthorized"), message: z.literal("Unauthorized") }),
			"Unauthorized error"
		),
		[HttpStatusCodes.OK]: jsonContent(meResponseSchema, "User's session and info")
	}
});

export const signout = createRoute({
	path: "/auth/signout",
	method: "post",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.object({ message: z.literal("Signed out successfully") }),
			"Signed out successfully"
		)
	}
});

export type SignupRoute = typeof signup;
export type SigninRoute = typeof signin;
export type MeRoute = typeof me;
export type SingoutRoute = typeof signout;
