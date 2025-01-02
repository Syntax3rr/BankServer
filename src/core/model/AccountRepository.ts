import { z } from "zod";
import { DBRepository } from "../../db/DBRepository";
import { db } from "../../db/db";
import { User } from "./UserRepository";

export const SubAccount = z.object({
    id: z.number(),
    currency: z.string(),
    balance: z.bigint(),
    weekly_limit: z.bigint(),
    is_mint: z.boolean(),
});

export const Account = z.object({
    id: z.number(),
    username: z.string(),
    account_name: z.string(),
    sub_accounts: z.array(SubAccount),
});

export type Account = z.infer<typeof Account>

interface AccountRepository {
    // getFromDB<V extends keyof Account>(index: {account: string, user: string}, ...params: V[]) {
    //     const result = await db.selectFrom("accounts")
    //         .innerJoin("user_accounts", "accounts.id", "user_accounts.account_id")
    //         .where("accounts.id", "=", index.account)
    //         .where("user_accounts.username", "=", index.user)
    //         .select(params)
    //         .executeTakeFirst();
    //
    //     const pickType: { [k in V]: never } = Object.assign({}, ...params.map((k) => ({ [k]: true } as { [k in V]: never })));
    //     const safeResult = Account.pick(pickType).safeParse(result);
    //
    //     if (!safeResult.success) {
    //         throw new Error("Failed to parse result: " + safeResult.error.message);
    //     }
    //
    //     return safeResult.data;
    // }

    getBalance(account: string, user: string): Promise<Pick<Account, "balance">>;
}