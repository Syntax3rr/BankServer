import { z } from "zod";
import { DBRepository } from "../../db/DBRepository";
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
export interface UserRepository {

    // protected override async getFromDB<V extends keyof User>(index: userIndex, ...params: V[]) {
    //     const keyIndex = Object.keys(index)[0] as keyof userIndex;
    //     const result = await db.selectFrom("users")
    //         .where(keyIndex, "=", index[keyIndex])
    //         .select(params)
    //         .executeTakeFirst();
    //
    //     if (result === undefined) {
    //         return null;
    //     }
    //
    //     const pickType: { [k in V]: never } = Object.assign({}, ...params.map((k) => ({ [k]: true } as { [k in V]: never })));
    //     const safeResult = User.pick(pickType).safeParse(result);
    //
    //     if (!safeResult.success) {
    //         throw new Error("Failed to parse result: " + safeResult.error.message);
    //     }
    //
    //     return safeResult.data;
    // }

    getUser(index: userIndex): Promise<User | null>;

    getAllUsers(): Promise<User[]>;

    createUser(user: User): Promise<void>;

    updateUser(index: userIndex, user: Partial<User>): Promise<void>;

    getAuthDetails(email: string): Promise<Pick<User, "username" | "is_admin">>;
}