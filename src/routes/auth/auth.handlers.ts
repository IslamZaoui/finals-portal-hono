import { deleteSessionTokenCookie, setSessionTokenCookie } from "@/lib/auth/cookie";
import { hashPassword, isPasswordStrong, verifyPasswordHash } from "@/lib/auth/password";
import { createSession, generateSessionToken, invalidateSession } from "@/lib/auth/session";
import { createUser, getUserByUsername, isUsernameAvailable } from "@/lib/auth/user";
import { requireAuth, requireGuest } from "@/lib/helpers/require";
import type { AppRouteHandler } from "@/lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { MeRoute, SigninRoute, SignupRoute, SingoutRoute } from "./auth.routes";

export const signup: AppRouteHandler<SignupRoute> = async (ctx) => {
	const { res, c } = requireGuest(ctx);
	if (res) {
		return res;
	}

	const { username, displayName, role, password } = c.req.valid("json");

	if (!(await isUsernameAvailable(username))) {
		return c.json(
			{
				code: "username_taken",
				message: "Username is already taken"
			} as const,
			HttpStatusCodes.CONFLICT
		);
	}

	if (!(await isPasswordStrong(password))) {
		return c.json(
			{
				code: "password_weak",
				message: "Password is weak"
			} as const,
			HttpStatusCodes.BAD_REQUEST
		);
	}

	const passwordHash = await hashPassword(password);
	const user = await createUser({ username, displayName, role, passwordHash });

	const sessionToken = generateSessionToken();
	const newSession = await createSession(sessionToken, user.id);
	setSessionTokenCookie(c, newSession);

	return c.json({ ...newSession, user } as const, HttpStatusCodes.OK);
};

export const signin: AppRouteHandler<SigninRoute> = async (ctx) => {
	const { res, c } = requireGuest(ctx);
	if (res) {
		return res;
	}

	const { username, password } = c.req.valid("json");

	const user = await getUserByUsername(username);
	if (!user) {
		return c.json(
			{
				code: "invalid_credentials",
				message: "invalid username or password"
			} as const,
			HttpStatusCodes.BAD_REQUEST
		);
	}

	if (!user.passwordHash) {
		return c.json(
			{
				code: "invalid_credentials",
				message: "invalid username or password"
			} as const,
			HttpStatusCodes.BAD_REQUEST
		);
	}

	const isPasswordValid = await verifyPasswordHash(user.passwordHash, password);
	if (!isPasswordValid) {
		return c.json(
			{
				code: "invalid_credentials",
				message: "invalid username or password"
			} as const,
			HttpStatusCodes.BAD_REQUEST
		);
	}

	const sessionToken = generateSessionToken();
	const newSession = await createSession(sessionToken, user.id);
	setSessionTokenCookie(c, newSession);

	return c.json({ ...newSession, user } as const, HttpStatusCodes.OK);
};

export const signout: AppRouteHandler<SingoutRoute> = async (c) => {
	if (c.var.session) {
		await invalidateSession(c.var.session.id);
		deleteSessionTokenCookie(c);
	}
	return c.json({ message: "Signed out successfully" } as const, HttpStatusCodes.OK);
};

export const me: AppRouteHandler<MeRoute> = async (ctx) => {
	const { res, c } = requireAuth(ctx);
	if (res) {
		return res;
	}

	return c.json(c.var.session!, HttpStatusCodes.OK);
};
