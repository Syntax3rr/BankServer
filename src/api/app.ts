import { extendZodWithOpenApi, fromHono } from "chanfana";
import { Hono } from "hono";
import Routes from "./routes/Routes";
import { z } from "zod";

extendZodWithOpenApi(z);

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
    docs_url: "/docs",
});

openapi.route("/api", Routes);

// Export the Hono app
export default app;
