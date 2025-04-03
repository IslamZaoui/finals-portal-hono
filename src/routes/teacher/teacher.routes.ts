import { createErrorObjectSchema } from '@/lib/helpers/response-schemas';
import {
	getProjectsRequestSchema,
	insertProjectSchema,
	projectSchema,
	updateProjectSchema
} from '@/schemas/project.schema';
import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent, jsonContentRequired } from 'stoker/openapi/helpers';
import { createErrorSchema, createMessageObjectSchema, IdUUIDParamsSchema } from 'stoker/openapi/schemas';

const tags = ['Teacher'];

export const projectsList = createRoute({
	path: '/teacher/projects',
	method: 'get',
	tags,
	request: {
		query: getProjectsRequestSchema
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createErrorObjectSchema('unauthorized', 'Unauthorized'),
			'Unauthorized'
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(getProjectsRequestSchema),
			'Get projects validation error'
		),
		[HttpStatusCodes.OK]: jsonContent(z.array(projectSchema), 'Projects list')
	}
});

export const createProject = createRoute({
	path: '/teacher/projects',
	method: 'post',
	tags,
	request: {
		body: jsonContentRequired(insertProjectSchema, 'Project info')
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createErrorObjectSchema('unauthorized', 'Unauthorized'),
			'Unauthorized'
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(insertProjectSchema),
			'Project validation error'
		),
		[HttpStatusCodes.CREATED]: jsonContent(projectSchema, 'Project created')
	}
});

export const updateProject = createRoute({
	path: '/teacher/projects/:id',
	method: 'patch',
	tags,
	request: {
		params: IdUUIDParamsSchema,
		body: jsonContent(updateProjectSchema, 'Project info')
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createErrorObjectSchema('unauthorized', 'Unauthorized'),
			'Unauthorized'
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createErrorObjectSchema('not_found', 'Project not found'),
			'Project not found'
		),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(updateProjectSchema),
			'Project validation error'
		),
		[HttpStatusCodes.OK]: jsonContent(projectSchema, 'Project updated')
	}
});

export const deleteProject = createRoute({
	path: '/teacher/projects/:id',
	method: 'delete',
	tags,
	request: {
		params: IdUUIDParamsSchema
	},
	responses: {
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createErrorObjectSchema('unauthorized', 'Unauthorized'),
			'Unauthorized'
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createErrorObjectSchema('not_found', 'Project not found'),
			'Project not found'
		),
		[HttpStatusCodes.OK]: jsonContent(
			createMessageObjectSchema('Project deleted successfully'),
			'Project deleteded'
		)
	}
});

export type ProjectsListRoute = typeof projectsList;
export type CreateProjectRoute = typeof createProject;
export type UpdateProjectRoute = typeof updateProject;
export type DeleteProjectRoute = typeof deleteProject;
