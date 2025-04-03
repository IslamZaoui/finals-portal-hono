import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { Env, Schema } from 'hono';
import type { PinoLogger } from 'hono-pino';

import type { SessionValidationResult } from './auth/session';

export interface AppBindings extends Env {
	Variables: {
		logger: PinoLogger;
		session: SessionValidationResult;
	};
}

export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
