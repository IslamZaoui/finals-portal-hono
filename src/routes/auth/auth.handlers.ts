import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { deleteSessionTokenCookie, setSessionTokenCookie } from "@/lib/auth/cookie";
import { hashPassword, isPasswordStrong, verifyPasswordHash } from "@/lib/auth/password";
import { createSession, generateSessionToken, invalidateSession } from "@/lib/auth/session";
import { createUser, getUserByUsername, isUsernameAvailable } from "@/lib/auth/user";

import type { MeRoute, SigninRoute, SignupRoute, SingoutRoute } from "./auth.routes";

export const signup: AppRouteHandler<SignupRoute> = async (c) => {
    if (c.var.session) {
        return c.json({
            code: "already_signed_in",
            message: "You are already signed in",
        } as const,
            HttpStatusCodes.UNAUTHORIZED,
        );
    }

    const { username, displayName, role, password } = c.req.valid("json");

    if (!(await isUsernameAvailable(username))) {
        return c.json(
            {
                code: "username_taken",
                message: "Username is already taken",
            } as const,
            HttpStatusCodes.CONFLICT,
        );
    }

    if (!isPasswordStrong(password)) {
        return c.json(
            {
                code: "password_weak",
                message: "Password is weak",
            } as const,
            HttpStatusCodes.BAD_REQUEST,
        );
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ username, displayName, role, passwordHash });

    const sessionToken = generateSessionToken();
    const newSession = await createSession(sessionToken, user.id);
    setSessionTokenCookie(c, newSession);

    return c.json({ message: "Signed up successfully" } as const, HttpStatusCodes.OK);
};

export const signin: AppRouteHandler<SigninRoute> = async (c) => {
    if (c.var.session) {
        return c.json(
            {
                code: "already_signed_in",
                message: "You are already signed in",
            } as const,
            HttpStatusCodes.UNAUTHORIZED,
        );
    }

    const { username, password } = c.req.valid("json");

    const user = await getUserByUsername(username);
    if (!user) {
        return c.json(
            {
                code: "invalid_credentials",
                message: "invalid username or password",
            } as const,
            HttpStatusCodes.BAD_REQUEST,
        );
    }

    const isPasswordValid = !user.passwordHash || await verifyPasswordHash(user.passwordHash, password);
    if (!isPasswordValid) {
        return c.json(
            {
                code: "invalid_credentials",
                message: "invalid username or password",
            } as const,
            HttpStatusCodes.BAD_REQUEST,
        );
    }

    const sessionToken = generateSessionToken();
    const newSession = await createSession(sessionToken, user.id);
    setSessionTokenCookie(c, newSession);

    return c.json({ message: "Signed in successfully" } as const, HttpStatusCodes.OK);
};

export const signout: AppRouteHandler<SingoutRoute> = async (c) => {
    if(c.var.session) {
        await invalidateSession(c.var.session.id);
        deleteSessionTokenCookie(c);
    }
    return c.json({ message: "Signed out successfully" } as const, HttpStatusCodes.OK);
};

export const me: AppRouteHandler<MeRoute> = async (c) => {
    const { session } = c.var;
    if (!session) {
        return c.json(
            {
                code: "unauthorized",
                message: "Unauthorized",
            } as const,
            HttpStatusCodes.UNAUTHORIZED,
        );
    }

    return c.json(session, HttpStatusCodes.OK);
}