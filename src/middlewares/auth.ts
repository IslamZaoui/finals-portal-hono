import { deleteSessionTokenCookie, getSessionTokenCookie, setSessionTokenCookie } from "@/lib/auth/cookie";
import { validateSessionToken } from "@/lib/auth/session";
import { factory } from "@/lib/factory";

export default () => {
    return factory.createMiddleware(async (c, next) => {
        const token = getSessionTokenCookie(c);
        if (!token) {
            c.set("session", null);
            return next();
        }

        const session = await validateSessionToken(token);
        c.set("session", session);

        if (session !== null) {
            setSessionTokenCookie(c, session);
        }
        else {
            deleteSessionTokenCookie(c);
        }

        return next();
    });
};
