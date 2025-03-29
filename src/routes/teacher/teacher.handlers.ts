import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/types";
import type { SQL } from "drizzle-orm";
import { and, eq, ilike } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { ProjectsListRoute } from "./teacher.routes";

export const projectsList: AppRouteHandler<ProjectsListRoute> = async (c) => {
	const { session } = c.var;
	if (!session) {
		return c.json(
			{
				code: "unauthorized",
				message: "Unauthorized"
			} as const,
			HttpStatusCodes.UNAUTHORIZED
		);
	}

	if (session.user.role !== "teacher") {
		return c.json(
			{
				code: "unauthorized",
				message: "Unauthorized"
			} as const,
			HttpStatusCodes.UNAUTHORIZED
		);
	}

	const { q, specialty, category } = c.req.valid("query");

	let query = { where: eq(projectsTable.author, session.userId) };
	const conditions = [eq(projectsTable.author, session.userId)];
	if (q) {
		conditions.push(ilike(projectsTable.title, `%${q}%`));
	}
	if (specialty) {
		conditions.push(eq(projectsTable.specialty, specialty));
	}
	if (category) {
		conditions.push(eq(projectsTable.category, category));
	}
	query = { where: and(...conditions) as SQL<unknown> };

	const data = await db.query.projectsTable.findMany(query);

	return c.json(data, HttpStatusCodes.OK);
};
