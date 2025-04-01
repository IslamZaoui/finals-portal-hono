import { projectsTable } from "@/db/schema";
import { z } from "@hono/zod-openapi";
import { schemaFactory } from "../factory";

export const getProjectsRequestSchema = z.object({
	q: z.string().optional(),
	specialty: z.enum(["L3 SI", "L3 ISIL", "M2 SIGL", "M2 IA", "M2 RTIC", "M2 IDO"]).optional(),
	category: z.string().optional()
});

export const projectSchema = schemaFactory.createSelectSchema(projectsTable);

export const insertProjectSchema = schemaFactory
	.createInsertSchema(projectsTable)
	.omit({ id: true, createdAt: true, updatedAt: true });

export const updateProjectSchema = schemaFactory
	.createUpdateSchema(projectsTable)
	.omit({ id: true, createdAt: true, updatedAt: true });
