## Migrations

If you are using drizzle-kit to manage your schema and roles, there may be situations where you want to refer to roles that are not defined in your Drizzle schema. In such cases, you may want drizzle-kit to skip managing these roles without having to define each role in your drizzle schema and marking it with `.existing()`.

In these cases, you can use `entities.roles` in `drizzle.config.ts`. For a complete reference, refer to the the [`drizzle.config.ts`](docs/drizzle-config-file) documentation.

By default, `drizzle-kit` does not manage roles for you, so you will need to enable this feature in `drizzle.config.ts`.

```ts {12-14}
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql',
  schema: "./drizzle/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true,
  entities: {
    roles: true
  }
});
```

In case you need additional configuration options, let's take a look at a few more examples.

**You have an `admin` role and want to exclude it from the list of manageable roles**

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      exclude: ['admin']
    }
  }
});
```

**You have an `admin` role and want to include it in the list of manageable roles**

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      include: ['admin']
    }
  }
});
```

**If you are using `Neon` and want to exclude Neon-defined roles, you can use the provider option**

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      provider: 'neon'
    }
  }
});
```

**If you are using `Supabase` and want to exclude Supabase-defined roles, you can use the provider option**

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      provider: 'supabase'
    }
  }
});
```

<Callout title='important'>
You may encounter situations where Drizzle is slightly outdated compared to new roles specified by your database provider. 
In such cases, you can use the `provider` option and `exclude` additional roles:

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...
  entities: {
    roles: {
      provider: 'supabase',
      exclude: ['new_supabase_role']
    }
  }
});
```
</Callout>

