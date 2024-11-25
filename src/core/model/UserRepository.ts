import { z } from "zod";
import { Repository } from "./Repository";
import { db } from "../../db/db";

export const User = z.object({
    username: z.string(),
    email: z.string(),
    pin: z.number(),
    is_admin: z.boolean()
});

export type User = z.infer<typeof User>

export type userIndex =
    { email: string } |
    { username: string }

// We use a Partial type for lazy loading from DB.
// If we had more users or more servers, we'd also want freshness checks.
// We are fine caching the user data since we don't expect it to change.
export class UserRepository extends Repository<User> {

    protected override async getFromDB<V extends keyof User>(index: userIndex, ...params: V[]) {
        const keyIndex = Object.keys(index)[0] as keyof userIndex;
        const result = await db.selectFrom("users")
            .where(keyIndex, "=", index[keyIndex])
            .select(params)
            .executeTakeFirst();

        const pickType: { [k in V]: never } = Object.assign({}, ...params.map((k) => ({ [k]: true } as { [k in V]: never })));
        const safeResult = User.pick(pickType).safeParse(result);

        if (!safeResult.success) {
            throw new Error("Failed to parse result: " + safeResult.error.message);
        }

        return safeResult.data;
    }

    public async getAuthDetails(email: string): Promise<Pick<User, "username" | "is_admin">> {
        const localUser = this.repository.get(email);
        if (localUser && localUser.username && localUser.is_admin != null) {
            return {
                username: localUser.username,
                is_admin: localUser.is_admin
            } as Pick<User, "username" | "is_admin">;
        }

        return await this.getFromDB({ email }, "username", "is_admin");
    }
}