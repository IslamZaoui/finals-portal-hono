import { getProjectsRequestSchema, insertProjectSchema, projectSchema } from "@/lib/schemas/project.schema";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

const tags = ["Teacher"];

export const projectsList = createRoute({
	path: "/teacher/projects",
	method: "get",
	tags,
	request: {
		query: getProjectsRequestSchema
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			z.object({ code: z.literal("unauthorized"), message: z.literal("Unauthorized") }),
			"Unauthorized"
		),
		[HttpStatusCodes.OK]: jsonContent(z.array(projectSchema), "Projects list")
	}
});

export const createProject = createRoute({
	path: "/teacher/projects",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(insertProjectSchema, "Project info")
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			z.object({ code: z.literal("unauthorized"), message: z.literal("Unauthorized") }),
			"Unauthorized"
		),
		[HttpStatusCodes.CREATED]: jsonContent(projectSchema, "Project created")
	}
});

export const updateProject = createRoute({
	path: "/teacher/projects/:id",
	method: "put",
	tags,
	request: {
		params: z.object({ id: z.string() }),
		body: jsonContentRequired(insertProjectSchema, "Project info")
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			z.object({ code: z.literal("unauthorized"), message: z.literal("Unauthorized") }),
			"Unauthorized"
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			z.object({ code: z.literal("not_found"), message: z.literal("Project not found") }),
			"Project not found"
		),
		[HttpStatusCodes.OK]: jsonContent(projectSchema, "Project updated")
	}
});

export const deleteProject = createRoute({
	path: "/teacher/projects/:id",
	method: "delete",
	tags,
	request: {
		params: z.object({ id: z.string() })
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			z.object({ code: z.literal("unauthorized"), message: z.literal("Unauthorized") }),
			"Unauthorized"
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			z.object({ code: z.literal("not_found"), message: z.literal("Project not found") }),
			"Project not found"
		),
		[HttpStatusCodes.OK]: jsonContent(
			z.object({ message: z.literal("Project deleted successfully") }),
			"Project deleted"
		)
	}
});

export type ProjectsListRoute = typeof projectsList;
export type CreateProjectRoute = typeof createProject;
export type UpdateProjectRoute = typeof updateProject;
export type DeleteProjectRoute = typeof deleteProject;
