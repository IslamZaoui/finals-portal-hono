import { createFactory } from "hono/factory";
import { createSchemaFactory } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';

import type { AppBindings } from "./types";

export const factory = createFactory<AppBindings>({
    defaultAppOptions: {
        strict: false,
    },
});

export const schemaFactory = createSchemaFactory({ zodInstance: z });
