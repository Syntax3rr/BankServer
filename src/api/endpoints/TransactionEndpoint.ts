// Get all transactions for an account. Filterable including pending transactions.
import { Context } from "hono";
import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class GetTransactions extends OpenAPIRoute {
    schema = {
        request: {
            headers: z.object({
                email: z.string(),
            }),
            query: z.object({
                account: z.string(),
                pending: z.string(),
            }),
        }
    };


    public async handle(ctx: Context) {
        const data = await this.getValidatedData<typeof this.schema>();

        const query = data.query;
        const email = ctx.get("email"); // Get the user from the context


        // Parse the user
        const authUser = ctx.get("email");


        // Get the transactions from the database


        // Return the transactions

        return new Response;
    }
}