import { Hono } from "hono";

const router = new Hono();

// Get all transactions for an account. Filterable including pending transactions.
router.get("/",);
// Get a transaction by ID.
router.get("/:transactionId");
// Create a new transaction.
router.post("/");
// Delete a pending transaction.
router.delete("/:transactionId");
// Complete/Cancel a pending transaction.
router.patch("/:transactionId");

export default router;