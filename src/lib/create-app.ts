import type { Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { notFound, onError } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import auth from "@/middlewares/auth";
import { pinoLogger } from "@/middlewares/pino-logger";

import type { AppBindings, AppOpenAPI } from "./types";

export function createRouter() {
	return new OpenAPIHono<AppBindings>({
		strict: false,
		defaultHook
	});
}

export default function createApp() {
	const app = createRouter();

	app.use(requestId())
		.use(pinoLogger())
		.use(auth())
		.use(
			cors({
				origin: "*",
				allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
				allowHeaders: ["Content-Type"],
				credentials: true
			})
		);

	app.notFound(notFound);
	app.onError(onError);
	return app;
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
	return createApp().route("/", router);
}
