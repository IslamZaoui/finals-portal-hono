import { pgView } from "drizzle-orm/pg-core";
import { usersTable } from "./schema";

export const usersWithoutPasswordView = pgView("users_view").as((qb) => qb.select({
    id: usersTable.id,
    username: usersTable.username,
    displayName: usersTable.displayName,
    role: usersTable.role,
    createdAt: usersTable.createdAt,
    updatedAt: usersTable.updatedAt
}).from(usersTable));