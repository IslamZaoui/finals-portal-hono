import configureOpenAPI from '@/lib/configure-open-api';
import createApp from '@/lib/create-app';
import auth from '@/routes/auth/auth.index';
import teacher from '@/routes/teacher/teacher.index';

const app = createApp();

configureOpenAPI(app);

const routes = [auth, teacher] as const;
routes.forEach((route) => {
	app.route('/', route);
});

export default app;

export type AppType = (typeof routes)[number];
