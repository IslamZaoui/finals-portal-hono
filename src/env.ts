import { z } from 'zod';

const EnvSchema = z.object({
	NODE_ENV: z.enum(['production', 'development']).default('development'),
	PORT: z.coerce.number().default(5173),
	LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
	DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required' }).url('Invalid DATABASE_URL'),
	FRONTEND_URL: z.string().url('Invalid FRONTEND_URL').optional()
});

const { data: env, error } = EnvSchema.safeParse(Bun.env);

if (error) {
	console.error('❌ Invalid env:');
	console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
	process.exit(1);
}

export default env!;

export type Env = z.infer<typeof EnvSchema>;

export const dev = env.NODE_ENV === 'development';
