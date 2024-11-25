# A Simple* Bank Server
This is a simple RESTful typescript bank server made for a minecraft server with some friends.

Currently, the server is set up to be deployed to Cloudflare Workers, though we'll probably switch to Bun.

## Features
- CRUD for accounts
- User management by admins
- Transactions
- Open transactions, where the sender can be set later
- User authentication through JWT
- Joint account management
- Custom currency support

## Tech Stack
- HonoJS
- Typescript
- Kysely Query Builder
- Zod
- Pg (Postgres)
