import type { AppBindings } from './types';

import { z } from '@hono/zod-openapi';
import { createSchemaFactory } from 'drizzle-zod';
import { createFactory } from 'hono/factory';

export const factory = createFactory<AppBindings>({
	defaultAppOptions: {
		strict: false
	}
});

export const schemaFactory = createSchemaFactory({ zodInstance: z });
