import { handle } from 'hono/vercel';

// eslint-disable-next-line antfu/no-import-dist
import app from '../dist/app.js';

export const runtime = 'nodejs';

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
export const HEAD = handle(app);
