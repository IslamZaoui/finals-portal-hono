import type { Context, Env } from "hono";

import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import type { Session } from "@/db/types";
import { dev } from "@/env";

const COOKIE_NAME = "sessionToken";

export function getSessionTokenCookie<T extends Env = Env>(c: Context<T>) {
	return getCookie(c, COOKIE_NAME);
}

export function setSessionTokenCookie<T extends Env = Env>(c: Context<T>, session: Session) {
	setCookie(c, COOKIE_NAME, session.token, {
		httpOnly: true,
		sameSite: "Lax",
		secure: !dev,
		expires: session.expiresAt,
		path: "/"
	});
}

export function deleteSessionTokenCookie<T extends Env = Env>(c: Context<T>) {
	deleteCookie(c, COOKIE_NAME, { path: "/" });
}
