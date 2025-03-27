import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export async function getUserByUsername(username: string) {
    return await db.query.usersTable.findFirst({ where: eq(usersTable.username, username) });
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
    const user = await getUserByUsername(username);
    return !user;
}

export async function createUser(data: { username: string; displayName: string; passwordHash: string; role: "student" | "teacher" }) {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user;
}
