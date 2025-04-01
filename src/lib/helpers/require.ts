import type { Context, Input } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { AppBindings } from "../types";

export function requireGuest<T extends AppBindings, U extends string, D extends Input>(c: Context<T, U, D>) {
	if (c.var.session) {
		return {
			c: undefined,
			res: c.json(
				{
					code: "already_authenticated",
					message: "You can't do that while signed in"
				} as const,
				HttpStatusCodes.UNAUTHORIZED
			)
		};
	}

	return {
		c,
		res: undefined
	};
}

export function requireAuth<T extends AppBindings, U extends string, D extends Input>(c: Context<T, U, D>) {
	if (!c.var.session) {
		return {
			c: undefined,
			res: c.json(
				{
					code: "unauthorized",
					message: "Unauthorized"
				} as const,
				HttpStatusCodes.UNAUTHORIZED
			)
		};
	}

	return {
		c,
		res: undefined
	};
}

export function requireAuthRole<T extends AppBindings, U extends string, D extends Input>(
	c: Context<T, U, D>,
	role: "teacher" | "student"
) {
	if (!c.var.session) {
		return {
			c: undefined,
			res: c.json(
				{
					code: "unauthorized",
					message: "Unauthorized"
				} as const,
				HttpStatusCodes.UNAUTHORIZED
			)
		};
	}

	if (c.var.session.user.role !== role) {
		return {
			c: undefined,
			res: c.json(
				{
					code: "unauthorized",
					message: "Unauthorized"
				} as const,
				HttpStatusCodes.UNAUTHORIZED
			)
		};
	}

	return {
		c,
		res: undefined
	};
}
