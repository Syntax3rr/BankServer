import { z } from "zod";
import { Repository } from "./Repository";
import { db } from "../../db/db";
import { User } from "./UserRepository";

export const Account = z.object({
    id: z.number(),
    username: z.string(),
    currency: z.string(),
    balance: z.bigint(),
    is_mint: z.boolean(),
    account_name: z.string(),
    weekly_limit: z.bigint(),
});

export type Account = z.infer<typeof Account>

export class AccountRepository extends Repository<Account> {
    protected override async getFromDB<V extends keyof Account>(index: {account: string, user: string}, ...params: V[]) {
        const result = await db.selectFrom("accounts")
            .innerJoin("user_accounts", "accounts.id", "user_accounts.account_id")
            .where("accounts.id", "=", index.account)
            .where("user_accounts.username", "=", index.user)
            .select(params)
            .executeTakeFirst();

        const pickType: { [k in V]: never } = Object.assign({}, ...params.map((k) => ({ [k]: true } as { [k in V]: never })));
        const safeResult = Account.pick(pickType).safeParse(result);

        if (!safeResult.success) {
            throw new Error("Failed to parse result: " + safeResult.error.message);
        }

        return safeResult.data;
    }

    public async getBalance(account: string, user: string): Promise<Pick<Account, "balance">> {
        const localAccount = this.repository.get(account);
        if (localAccount && localAccount.balance != null) {
            return {
                balance: localAccount.balance
            } as Pick<Account, "balance">;
        }

        return await this.getFromDB({account, user}, "balance");
    }
}