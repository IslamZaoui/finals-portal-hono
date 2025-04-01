import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/types";
import type { SQL } from "drizzle-orm";
import { and, eq, ilike } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { CreateProjectRoute, DeleteProjectRoute, ProjectsListRoute, UpdateProjectRoute } from "./teacher.routes";

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

export const createProject: AppRouteHandler<CreateProjectRoute> = async (c) => {
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

	const { title, description, specialty, category } = c.req.valid("json");

	const [project] = await db
		.insert(projectsTable)
		.values({
			title,
			description,
			specialty,
			category,
			author: session.userId
		})
		.returning();

	return c.json(project, HttpStatusCodes.CREATED);
};

export const updateProject: AppRouteHandler<UpdateProjectRoute> = async (c) => {
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

	const { id } = c.req.valid("param");
	const { title, description, specialty, category } = c.req.valid("json");

	const [project] = await db
		.update(projectsTable)
		.set({
			title,
			description,
			specialty,
			category
		})
		.where(and(eq(projectsTable.id, id), eq(projectsTable.author, session.userId)))
		.returning();

	if (!project) {
		return c.json(
			{
				code: "not_found",
				message: "Project not found"
			} as const,
			HttpStatusCodes.NOT_FOUND
		);
	}

	return c.json(project, HttpStatusCodes.OK);
};

export const deleteProject: AppRouteHandler<DeleteProjectRoute> = async (c) => {
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

	const { id } = c.req.valid("param");

	const [project] = await db
		.delete(projectsTable)
		.where(and(eq(projectsTable.id, id), eq(projectsTable.author, session.userId)))
		.returning();

	if (!project) {
		return c.json(
			{
				code: "not_found",
				message: "Project not found"
			} as const,
			HttpStatusCodes.NOT_FOUND
		);
	}

	return c.json({ message: "Project deleted successfully" }, HttpStatusCodes.OK);
};
