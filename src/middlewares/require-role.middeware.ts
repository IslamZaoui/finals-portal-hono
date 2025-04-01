import { factory } from "@/lib/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

export default function requireRole(role: "teacher" | "student") {
	return factory.createMiddleware(async (c, next) => {
		if (c.var.session!.user.role !== role) {
			return c.json(
				{
					code: "unauthorized",
					message: "Unauthorized"
				} as const,
				HttpStatusCodes.UNAUTHORIZED
			);
		}

		return next();
	});
}
