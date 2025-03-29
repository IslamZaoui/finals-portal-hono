import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/types";
import { eq } from "drizzle-orm";
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

	const projects = await db.query.projectsTable.findMany({ where: eq(projectsTable.author, session.userId) });

	return c.json(projects, HttpStatusCodes.OK);
};
