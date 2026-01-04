# Drizzle \<\> Cloudflare Durable Objects SQLite

<Prerequisites>
- Database [connection basics](/docs/connect-overview) with Drizzle
- **Cloudflare SQLite Durable Objects** - SQLite database embedded within a Durable Object - [read here](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/#sqlite-storage-backend)
</Prerequisites>
  
Drizzle ORM fully supports the Cloudflare Durable Objects database and Cloudflare Workers environment.
We embrace SQL dialects and dialect specific drivers and syntax and mirror most popular 
SQLite-like `all`, `get`, `values` and `run` query methods syntax.

To setup project for your Cloudflare Durable Objects please refer to **[official docs.](https://developers.cloudflare.com/durable-objects)**

#### Step 1 - Install packages
<Npm>
drizzle-orm
-D drizzle-kit
</Npm>

#### Step 2 - Initialize the driver and make a query

You would need to have a `wrangler.toml` file for Durable Objects database and will look something like this:
```toml {16-18,21-24}
#:schema node_modules/wrangler/config-schema.json
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

