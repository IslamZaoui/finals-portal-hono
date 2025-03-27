/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

const EnvSchema = z.object({
    NODE_ENV: z.enum(["production", "development"]).default("development"),
    PORT: z.coerce.number().default(5173),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});

const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
    console.error("❌ Invalid env:");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    process.exit(1);
}

export default env!;

export type Env = z.infer<typeof EnvSchema>;

export const dev = env.NODE_ENV === "development";
