import { z } from "@hono/zod-openapi";

export function createErrorObjectSchema(code: string, message: string) {
	return z
		.object({
			code: z.literal(code),
			message: z.literal(message)
		})
		.openapi({
			example: {
				code,
				message
			}
		});
}
