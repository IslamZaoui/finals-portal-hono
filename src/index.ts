import app from './app';
import env from './env';

const server = Bun.serve({
	fetch: app.fetch,
	port: env.PORT
});

console.log(`Server is running on ${server.url.href}`);
