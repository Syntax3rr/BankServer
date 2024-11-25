import { extendZodWithOpenApi, fromHono } from "chanfana";
import { Hono } from "hono";
import auth from "./middleware/jwt-auth";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

app.use(auth);

// Register OpenAPI endpoints
// openapi.get("/api/tasks", TaskList);
// openapi.post("/api/tasks", TaskCreate);
// openapi.get("/api/tasks/:taskSlug", TaskFetch);
// openapi.delete("/api/tasks/:taskSlug", auth, TaskDelete);

// Export the Hono app
export default app;