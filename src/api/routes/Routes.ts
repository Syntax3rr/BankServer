import { Hono } from "hono";
import TransactionRoutes from "./TransactionRoutes";
import { fromHono } from "chanfana";

const router = fromHono(new Hono(), {
    base: "/api",
});

router.registry.registerComponent(
    "securitySchemes",
    "BearerAuth",
    {
        type: "http",
        scheme: "bearer",
    },
);

router.route("/transactions", TransactionRoutes);

export default router;