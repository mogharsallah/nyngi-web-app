# New Features

**🎉 Pull relations**

Drizzle will now pull `relations` from the database by extracting foreign key information and translating it into a `relations` object. You can view the `relations.ts` file in the `out` folder after introspection is complete

For more info about relations, please check [the docs](/docs/rqb#declaring-relations)


**🎉 Custom name for generated migrations**

To specify a name for your migration you should use `--name <name>`

Usage
```
drizzle-kit generate --name init_db
```

**🎉 New command `migrate`**

You can now apply generated migrations to your database directly from `drizzle-kit`

Usage
```
drizzle-kit migrate
```

By default, drizzle-kit will store migration data entries in the `__drizzle_migrations` table and, in the case of PostgreSQL, in a `drizzle` schema. If you want to change this, you will need to specify the modifications in `drizzle.config.ts`.

```ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    migrations: {
        table: "migrations",
        schema: "public"
    }
})
```

Source: https://orm.drizzle.team/docs/upgrade-v1

import Npm from "@mdx/Npm.astro";
import Npx from "@mdx/Npx.astro";
import Prerequisites from "@mdx/Prerequisites.astro";

