import {
    bigint,
    boolean,
    char,
    integer,
    pgEnum,
    pgTable,
    smallint,
    text,
    timestamp,
    uuid,
    varchar
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
    username: text("username").primaryKey(),
    email: text("email").notNull().unique(),
    pin: integer("pin"),
    isAdmin: boolean("is_admin").default(false),
});

export const userRelations = relations(usersTable, ({ many }) => ({
    userAccountsTable: many(userAccountsTable),
}));

export const currenciesTable = pgTable("currencies", {
    code: char("code", { length: 3 }).primaryKey(), // i.e. USD
    name: text("name").unique().notNull(),
    symbol: char("symbol", { length: 1 }).unique().notNull(),
    decimals: smallint("decimals").notNull(),
});

export const currencyRelations = relations(currenciesTable, ({ one, many }) => ({
    accounts: many(accountsTable),
    transactions: many(transactionsTable),
    pendingTransactions: many(pendingTransactionsTable),
}));

export const accountsTable = pgTable("accounts", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    currency: char("currency", { length: 3 }).notNull().references(() => currenciesTable.code),
    balance: bigint("balance", {mode: "bigint"}).notNull().default(0n),
    isPublic: boolean("is_public").notNull().default(false),
    isMint: boolean("is_mint").notNull().default(false),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const accountRelations = relations(accountsTable, ({ one, many }) => ({
    userAccounts: many(userAccountsTable),
    transactions: many(transactionsTable),
    pendingTransactions: many(pendingTransactionsTable),
    currency: one(currenciesTable, {
        fields: [accountsTable.currency],
        references: [currenciesTable.code],
    }),
}));

export const userAccountsTable = pgTable("user_accounts", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    username: text("username").notNull().references(() => usersTable.username),
    accountId: uuid("account_id").notNull().references(() => accountsTable.id),
    accountName: varchar("account_name", { length: 255 }),
    weeklyLimit: bigint("weekly_limit", {mode: "bigint"}).notNull().default(0n), //0 means no limit
});

export const userAccountRelations = relations(userAccountsTable, ({ one }) => ({
    account: one(accountsTable, {
        fields: [userAccountsTable.accountId],
        references: [accountsTable.id],
    }),
    user: one(usersTable, {
        fields: [userAccountsTable.username],
        references: [usersTable.username],
    })
}));

export const transactionsTable = pgTable("transactions", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    fromAccount: uuid("from_account").notNull().references(() => accountsTable.id),
    toAccount: uuid("to_account").notNull().references(() => accountsTable.id),
    currency: char("currency", { length: 3 }).notNull().references(() => currenciesTable.code),
    amount: bigint("amount", {mode:"bigint"}).notNull(),
    description: text("description"),
    executedAt: timestamp("executed_at").notNull().default(sql`now()`),
    createdAt: timestamp("created_at").notNull(),
});

export const transactionRelations = relations(transactionsTable, ({ one }) => ({
    fromAccount: one(accountsTable, {
        fields: [transactionsTable.fromAccount],
        references: [accountsTable.id],
    }),
    toAccount: one(accountsTable, {
        fields: [transactionsTable.toAccount],
        references: [accountsTable.id],
    }),
    currency: one(currenciesTable, {
        fields: [transactionsTable.currency],
        references: [currenciesTable.code],
    }),
}));

// Pending transactions are unexecuted and may not have a sender specified.
export const pendingTransactionsTable = pgTable("pending_transactions", {
    id: uuid().primaryKey().default(sql`gen_random_uuid()`),
    fromAccount: uuid("from_account").references(() => accountsTable.id),
    toAccount: uuid("to_account").notNull().references(() => accountsTable.id),
    currency: char("currency", { length: 3 }).notNull().references(() => currenciesTable.code),
    amount: bigint("amount", {mode:"bigint"}).notNull(),
    description: text("description"),
    expiresAt: timestamp("expires_at").notNull().default(sql`now() + interval '5 minutes'`),
    createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const pendingTransactionRelations = relations(pendingTransactionsTable, ({ one }) => ({
    fromAccount: one(accountsTable, {
        fields: [pendingTransactionsTable.fromAccount],
        references: [accountsTable.id],
    }),
    toAccount: one(accountsTable, {
        fields: [pendingTransactionsTable.toAccount],
        references: [accountsTable.id],
    }),
    currency: one(currenciesTable, {
        fields: [pendingTransactionsTable.currency],
        references: [currenciesTable.code],
    }),
}));

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect

export type InsertCurrency = typeof currenciesTable.$inferInsert
export type SelectCurrency = typeof currenciesTable.$inferSelect

export type InsertAccount = typeof accountsTable.$inferInsert
export type SelectAccount = typeof accountsTable.$inferSelect

export type InsertUserAccount = typeof userAccountsTable.$inferInsert
export type SelectUserAccount = typeof userAccountsTable.$inferSelect

export type InsertTransaction = typeof transactionsTable.$inferInsert
export type SelectTransaction = typeof transactionsTable.$inferSelect

export type InsertPendingTransaction = typeof pendingTransactionsTable.$inferInsert
export type SelectPendingTransaction = typeof pendingTransactionsTable.$inferSelect


//// Because BigInts aren't supported by JSON.serialize()
interface BigInt {
    /** Convert to BigInt to string form in JSON.stringify */
    toJSON: () => string;
}

// @ts-expect-error TS2339: Property toJSON does not exist on type BigInt
BigInt.prototype.toJSON = function () {
    return this.toString();
};
