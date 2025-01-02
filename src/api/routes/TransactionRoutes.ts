import { Hono } from "hono";
import auth from "../middleware/jwt-auth";
import { GetTransactions } from "../endpoints/TransactionEndpoint";
import { fromHono } from "chanfana";

const router = fromHono(new Hono(), {
    base: "/api/transactions",
    schema: {
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
});

router.registry.registerComponent(
    "securitySchemes",
    "BearerAuth",
    {
        type: "http",
        scheme: "bearer",
    },
);

router.use(auth);

// Get all transactions for an account. Filterable including pending transactions.
router.get("/", GetTransactions);
// Get a transaction by ID.
router.get("/:transactionId");
// Create a new transaction.
router.post("/");
// Delete a pending transaction.
router.delete("/:transactionId");
// Complete/Cancel a pending transaction.
router.patch("/:transactionId");

export default router;