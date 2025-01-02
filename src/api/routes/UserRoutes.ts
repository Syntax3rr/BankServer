import { Hono } from "hono";
import auth from "../middleware/jwt-auth";
import { fromHono } from "chanfana";

const router = fromHono(new Hono(), {
    base: "/api/users",
});

// Get all users. Filterable.
router.get("/", auth);
// Get a transaction by ID.
router.get("/:transactionId", auth);
// Create a new transaction.
router.post("/", auth);
// Delete a pending transaction.
router.delete("/:transactionId", auth);
// Complete/Cancel a pending transaction.
router.patch("/:transactionId", auth);

export default router;