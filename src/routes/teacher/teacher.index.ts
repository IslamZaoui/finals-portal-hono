import { createRouter } from "@/lib/create-app";
import * as handlers from "./teacher.handlers";
import * as routes from "./teacher.routes";

const router = createRouter().openapi(routes.projectsList, handlers.projectsList);

export default router;
