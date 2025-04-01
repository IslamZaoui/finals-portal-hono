import { factory } from "@/lib/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

export default function requireGuest() {
	return factory.createMiddleware(async (c, next) => {
		if (c.var.session) {
			return c.json(
				{
					code: "already_authenticated",
					message: "You can't do that while signed in"
				} as const,
				HttpStatusCodes.UNAUTHORIZED
			);
		}

		return next();
	});
}
