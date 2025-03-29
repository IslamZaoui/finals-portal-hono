import { getProjectsRequestSchema, projectSchema } from "@/lib/schemas/project.schema";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

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

export type ProjectsListRoute = typeof projectsList;
