import { z } from "zod";

export const Transaction = z.object({
    id: z.string(),
    from_account: z.string().optional(),
    to_account: z.string(),
    currency: z.string(),
    amount: z.bigint(),
    description: z.string(),
    is_pending: z.boolean(),
    created_at: z.string(),
    expires_at: z.string().optional(),
    executed_at: z.string().optional(),
});

export type Transaction = z.infer<typeof Transaction>

export type transactionIndex = { id: string }

export interface TransactionRepository {
    getFields<V extends keyof Transaction>(index: transactionIndex, ...params: V[]): Promise<Transaction | null>;

    getAll(query: Partial<Transaction>): Promise<Transaction[]>;

    get(transactionId: string): Promise<Transaction | null>;

    set(transaction: Transaction): Promise<void>;

    delete(transactionId: string): Promise<void>;

    execute(transactionId: string): Promise<void>;
}