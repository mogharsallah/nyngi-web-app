## Changelog

**❗ Snapshots Upgrade**

All PostgreSQL and SQLite-generated snapshots will be upgraded to version 6. You will be prompted to upgrade them by running `drizzle-kit up`

**❗ Removing :dialect from `drizzle-kit` cli commands**

You can now just use commands, like:

- `drizzle-kit generate`
- `drizzle-kit push`
- etc.

without specifying dialect. This param is moved to `drizzle.config.ts`

**❗ `drizzle.config` update**

- `dialect` is now mandatory; specify which database dialect you are connecting to. Options include `mysql`, `postgresql`, or `sqlite`.
- `driver` has become optional and will have a specific driver, each with a different configuration of `dbCredentials`. Available drivers are:
  - `aws-data-api`
  - `turso`
  - `d1-http` - currently WIP
  - `expo`
- `url` - a unified parameter for the previously existing `connectionString` and `uri`.
- `migrations` - a new object parameter to specify a custom table and schema for the migrate command:
  - `table` - the custom table where drizzle will store migrations.
  - `schema` - the custom schema where drizzle will store migrations (Postgres only).

Usage examples for all new and updated commands
```ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "sqlite", // "postgresql" | "mysql"
    driver: "turso"
    dbCredentials: {
        url: ""
    },
    migration: {
        table: "migrations",
        schema: "public"
    }
})
```

Drizzle driver selection follows the current strategy:

If a `driver` is specified, use this driver for querying.

If no driver is specified:

- For `postgresql` dialect, Drizzle will:
  - Check if the `pg` driver is installed and use it.
  - If not, try to find the `postgres` driver and use it.
  - If still not found, try to find `@vercel/postgres`.
  - Then try `@neondatabase/serverless`.
  - If nothing is found, an error will be thrown.

- For `mysql` dialect, Drizzle will:
  - Check if the `mysql2` driver is installed and use it.
  - If not, try to find `@planetscale/database` and use it.
  - If nothing is found, an error will be thrown.

- For `sqlite` dialect, Drizzle will:
  - Check if the `@libsql/client` driver is installed and use it.
  - If not, try to find `better-sqlite3` and use it.
  - If nothing is found, an error will be thrown

**❗ MySQL schemas/database are no longer supported by drizzle-kit**

Drizzle Kit won't handle any schema changes for additional schemas/databases in your drizzle schema file

