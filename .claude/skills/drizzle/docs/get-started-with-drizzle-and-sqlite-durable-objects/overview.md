# Get Started with Drizzle and SQLite Durable Objects

<Prerequisites>  
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **Cloudflare SQLite Durable Objects** - SQLite database embedded within a Durable Object - [read here](https://developers.cloudflare.com/durable-objects/api/sql-storage/)
  - **wrangler** - Cloudflare Developer Platform command-line interface - [read here](https://developers.cloudflare.com/workers/wrangler)
</Prerequisites>

<FileStructure />

#### Step 1 - Install required packages
<InstallPackages lib='wrangler'/>

#### Step 2 - Setup wrangler.toml

You would need to have a `wrangler.toml` file for D1 database and will look something like this:
```toml
#:schema node_modules/wrangler/config-schema.json
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

