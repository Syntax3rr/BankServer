import { createMiddleware } from "hono/factory";
import * as jose from "jose";

const auth = createMiddleware(async (ctx, next) => {
    // Get the Authorization header from the request
    const authHeader = ctx.req.header("Authorization");

    // Check if the request has an Authorization header
    if (!authHeader) {
        // If not, return a 401 Unauthorized response
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        });
    }

    // Get the token from the Authorization header
    const token = authHeader.split("Bearer ")[1];

    // Get the public key from the JWKS endpoint
    const jwks = jose.createRemoteJWKSet(
        new URL("https://syntax3rr.us.auth0.com/.well-known/jwks.json")
    );
    // Verify the token
    const { payload, protectedHeader } = await jose.jwtVerify(token, jwks, {
        issuer: "https://syntax3rr.us.auth0.com/",
        audience: "https://florinapi.nullpt3r.com",
    });

    if (!payload) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        });
    }

    const email = payload["email"];

    if (!email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: {
                "content-type": "application/json; charset=utf-8",
            },
        });
    }

    // Set the user in the context
    ctx.set("email", email);

    // Continue to the next middleware
    return next();
});

export default auth;
