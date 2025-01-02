import { Transaction as CoreTransaction, transactionIndex, TransactionRepository } from "../core/model/TransactionRepository";
import { undefined } from "zod";
import { db } from "./db";

export default class TransactionDBRepository implements TransactionRepository {
    public async get(transactionId: string): Promise<CoreTransaction | null> {
        const entry = await db.selectFrom("transactions")
            .where("transactions.id", "=", transactionId)
            .selectAll()
            .executeTakeFirst();

        if (entry == null) {
            return null;
        }

        const extendedEntry = {
            ...entry,
            is_pending: entry.executed_at == null
        };

        const safeResult = CoreTransaction.safeParse(extendedEntry);

        return safeResult.success ? safeResult.data : null;
    }

    public async getAll(query: Partial<Pick<CoreTransaction, "from_account" | "to_account" | "currency" | "status">>): Promise<CoreTransaction[]> {
        const table = db.selectFrom("transactions");

        let k: keyof Partial<Pick<CoreTransaction, "from_account" | "to_account" | "currency" | "status">>;

        for (k in query) {
            const v = query[k];
            if (v != null) {
                table.where(k, "=", v);
            }
        }

        const entries = await table.selectAll().execute();

        return entries.map(entry => {
            const extendedEntry = {
                ...entry,
                is_pending: !Object.keys(entry).includes("executed_at")
            };

            const safeResult = CoreTransaction.safeParse(extendedEntry);

            return safeResult.success ? safeResult.data : null;
        }).filter((entry): entry is CoreTransaction => entry != null);
    }

    public async getFields<V extends keyof CoreTransaction>(index: transactionIndex, ...params: V[]) {
        const result = await db.selectFrom("transactions")
            .where("id", "=", index.id)
            .select(params)
            .executeTakeFirst();

        if (result == null) {
            return null;
        }

        const pickType: { [k in V]: never } = Object.assign({}, ...params.map((k) => ({ [k]: true } as { [k in V]: never }));
        const safeResult = CoreTransaction.pick(pickType).safeParse(result);

        return safeResult.success ? safeResult.data : null;
    }

    delete(transactionId: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    execute(transactionId: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    set(transaction: CoreTransaction): Promise<void> {
        return Promise.resolve(undefined);
    }

}