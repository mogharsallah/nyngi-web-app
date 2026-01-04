## How to migrate to `0.21.0`

#### 1. Remove all `:dialect` prefixes from your drizzle-kit commands.
Example: Change `drizzle-kit push:mysql` to `drizzle-kit push`.

#### 2. Update your `drizzle.config.ts` file:
 - Add `dialect` to `drizzle.config.ts`. It is now mandatory and can be `postgresql`, `mysql`, or `sqlite`.
 - Add `driver` to `drizzle.config.ts` ONLY if you are using `aws-data-api`, `turso`, `d1-http`(WIP), or `expo`. Otherwise, you can remove the `driver` from `drizzle.config.ts`.
 - If you were using `connectionString` or `uri` in `dbCredentials`, you should now use `url`.
    
```ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "sqlite", // "postgresql" | "mysql"
    driver: "turso", // optional and used only if `aws-data-api`, `turso`, `d1-http`(WIP) or `expo` are used
    dbCredentials: {
        url: ""
    }
})
```

#### 3. If you are using PostgreSQL or SQLite and had migrations generated in your project, please run `drizzle-kit up` so Drizzle can upgrade all the snapshots to version 6.

<Callout>
  You can check everything that was changed in `0.21.0` in details here
</Callout>

