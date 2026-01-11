## Why not SQL-like?

We're always striving for a perfectly balanced solution. While SQL-like queries cover 100% of your needs, 
there are certain common scenarios where data can be queried more efficiently.

We've built the Queries API so you can fetch relational, nested data from the database in the most convenient 
and performant way, without worrying about joins or data mapping.

**Drizzle always outputs exactly one SQL query**. Feel free to use it with serverless databases,
and never worry about performance or roundtrip costs!

<Section>
```ts
const result = await db.query.users.findMany({
	with: {
		posts: true
	},
});
```
{/* ```sql
SELECT * FROM users ...
``` */}
</Section>

## Advanced
With Drizzle, queries can be composed and partitioned in any way you want. You can compose filters 
independently from the main query, separate subqueries or conditional statements, and much more. 
Let's check a few advanced examples:

#### Compose a WHERE statement and then use it in a query
```ts
async function getProductsBy({
  name,
  category,
  maxPrice,
}: {
  name?: string;
  category?: string;
  maxPrice?: string;
}) {
  const filters: SQL[] = [];

  if (name) filters.push(ilike(products.name, name));
  if (category) filters.push(eq(products.category, category));
  if (maxPrice) filters.push(lte(products.price, maxPrice));

  return db
    .select()
    .from(products)
    .where(and(...filters));
}
```

#### Separate subqueries into different variables, and then use them in the main query
```ts
const subquery = db
	.select()
	.from(internalStaff)
	.leftJoin(customUser, eq(internalStaff.userId, customUser.id))
	.as('internal_staff');

const mainQuery = await db
	.select()
	.from(ticket)
	.leftJoin(subquery, eq(subquery.internal_staff.userId, ticket.staffId));
```

#### What's next?
<br/>
<Flex>
  <LinksList 
    title='Access your data'
    links={[
        ["Query", "/docs/rqb"], 
        ["Select", "/docs/select"],
        ["Insert", "/docs/insert"],
        ["Update", "/docs/update"],
        ["Delete", "/docs/delete"],
        ["Filters", "/docs/operators"],
        ["Joins", "/docs/joins"],
        ["sql`` operator", "/docs/sql"],
      ]}
  />
  <LinksList 
    title='Zero to Hero'
    links={[
        ["Migrations", "/docs/migrations"], 
      ]}
  />
</Flex>


Source: https://orm.drizzle.team/docs/delete

import IsSupportedChipGroup from '@mdx/IsSupportedChipGroup.astro';
import Callout from '@mdx/Callout.astro';
import Section from '@mdx/Section.astro';

# SQL Delete
You can delete all rows in the table:
```typescript copy
await db.delete(users);
```
And you can delete with filters and conditions:
```typescript copy
await db.delete(users).where(eq(users.name, 'Dan'));
```

### Limit

<IsSupportedChipGroup chips={{ 'PostgreSQL': false, 'MySQL': true, 'SQLite': true, 'SingleStore': true, 'MSSQL': false, 'CockroachDB': false }} />

Use `.limit()` to add `limit` clause to the query - for example:
<Section>
```typescript
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
```
```sql
delete from "users" where "users"."name" = $1 limit $2;
```
</Section>

### Order By
Use `.orderBy()` to add `order by` clause to the query, sorting the results by the specified fields:
<Section>
```typescript
import { asc, desc } from 'drizzle-orm';

await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(desc(users.name));

// order by multiple fields
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name, users.name2);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(asc(users.name), desc(users.name2));
```
```sql
delete from "users" where "users"."name" = $1 order by "name";
delete from "users" where "users"."name" = $1 order by "name" desc;

delete from "users" where "users"."name" = $1 order by "name", "name2";
delete from "users" where "users"."name" = $1 order by "name" asc, "name2" desc;
```
</Section>

### Returning
<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'SQLite': true, 'MySQL': false, 'SingleStore': false, 'MSSQL': false, 'CockroachDB': true }} />
You can delete a row and get it back in PostgreSQL and SQLite:
```typescript copy
const deletedUser = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning();

// partial return
const deletedUserIds: { deletedId: number }[] = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning({ deletedId: users.id });
```

## Output
<IsSupportedChipGroup chips={{ 'MSSQL': true }} />
You can insert a row and get it back in PostgreSQL and SQLite like such:
```typescript copy
await db.insert(users).values({ name: "Dan" }).output();

// partial return
await db.insert(users).values({ name: "Partial Dan" }).output({ insertedId: users.id });
```

## WITH DELETE clause

<Callout>
  Check how to use WITH statement with [select](/docs/select#with-clause), [insert](/docs/insert#with-insert-clause), [update](/docs/update#with-update-clause)
</Callout>

Using the `with` clause can help you simplify complex queries by splitting them into smaller subqueries called common table expressions (CTEs):
<Section>
```typescript copy
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders)
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({
		id: orders.id
	});
```
```sql
with "average_amount" as (select avg("amount") as "value" from "orders") 
delete from "orders" 
where "orders"."amount" > (select * from "average_amount") 
returning "id"
```
</Section>

Source: https://orm.drizzle.team/docs/drizzle-config-file

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import SchemaFilePaths from "@mdx/SchemaFilePaths.mdx"
import Prerequisites from "@mdx/Prerequisites.astro"
import Dialects from "@mdx/Dialects.mdx"
import Drivers from "@mdx/Drivers.mdx"
import DriversExamples from "@mdx/DriversExamples.mdx"
import Npx from "@mdx/Npx.astro"

# Drizzle Kit configuration file
<Prerequisites>
- Get started with Drizzle and `drizzle-kit` - [read here](/docs/get-started)
- Drizzle schema fundamentals - [read here](/docs/sql-schema-declaration)
- Database connection basics - [read here](/docs/connect-overview)
- Drizzle migrations fundamentals - [read here](/docs/migrations)
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file)
</Prerequisites>

Drizzle Kit lets you declare configuration options in `TypeScript` or `JavaScript` configuration files.

<Section>
```plaintext {5}
📦 <project root>
 ├ ...
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```
<CodeTabs items={["drizzle.config.ts", "drizzle.config.js"]}>
<CodeTab>
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```
</CodeTab>
<CodeTab>
```js
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```
</CodeTab>
</CodeTabs>
</Section>

Example of an extended config file
```ts collapsable
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/schema.ts",

  driver: "pglite",
  dbCredentials: {
    url: "./database/",
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  entities: {
    roles: {
      provider: '',
      exclude: [],
      include: []
    }
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
```

### Multiple configuration files
You can have multiple config files in the project, it's very useful when you have multiple database stages or multiple databases or different databases on the same project:
<Npx>
  drizzle-kit generate --config=drizzle-dev.config.ts
  drizzle-kit generate --config=drizzle-prod.config.ts
</Npx>
```plaintext {5-6}
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Migrations folder
`out` param lets you define folder for your migrations, it's optional and `drizzle` by default.  
It's very useful since you can have many separate schemas for different databases in the same project 
and have different migration folders for them.  
  
Migration folder contains folders with `.sql` migration files which is used by `drizzle-kit`

<Section>
```plaintext {3}
📦 <project root>
 ├ ...
 ├ 📂 drizzle
 │ ├ 📂 20242409125510_premium_mister_fear
 │ ├ 📜 user.ts 
 │ ├ 📜 post.ts 
 │ └ 📜 comment.ts 
 ├ 📂 src
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```
```ts {5}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql" | "turso" | "singlestore" | "mssql"
  schema: "./src/schema/*",
  out: "./drizzle",
});
```
</Section>

## ---

### `dialect`
<rem025/>

Dialect of the database you're using 
|               |                                                 |
| :------------ | :-----------------------------------            |
| type        | <Dialects/>                                     |
| default        | --                                     |
| commands    | `generate` `migrate` `push` `pull` `check` `up` |

<rem025/>
```ts {4}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql", 
});
```


### `schema`
<rem025/>

[`glob`](https://www.digitalocean.com/community/tools/glob?comments=true&glob=/**/*.js&matches=false&tests=//%20This%20will%20match%20as%20it%20ends%20with%20'.js'&tests=/hello/world.js&tests=//%20This%20won't%20match!&tests=/test/some/globs)
 based path to drizzle schema file(s) or folder(s) contaning schema files.
|               |                      |
| :------------ | :-----------------   |
| type          | `string` `string[]` |
| default        | --                    |
| commands      | `generate` `push`    |

<rem025/>
<SchemaFilePaths />


### `out`
<rem025/>

Defines output folder of your SQL migration files, json snapshots of your schema and `schema.ts` from `drizzle-kit pull` command.
|               |                      |
| :------------ | :-----------------   |
| type          | `string` `string[]` |
| default        | `drizzle`                    |
| commands      | `generate` `migrate` `push` `pull` `check` `up`    |

<rem025/>
```ts {4}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle", 
});
```

### `driver`
<rem025/>

Drizzle Kit automatically picks available database driver from your current project based on the provided `dialect`, 
yet some vendor specific databases require a different subset of connection params.

`driver` option let's you explicitely pick those exceptions drivers.

|               |                      |
| :------------ | :-----------------   |
| type          | <Drivers/> |
| default        | --                    |
| commands      | `migrate` `push` `pull`   |

<rem025/>

<DriversExamples/>

## ---

### `dbCredentials`
<rem025/>

Database connection credentials in a form of `url`, 
`user:password@host:port/db` params or exceptions drivers(<Drivers/>) specific connection options.

|               |                      |
| :------------ | :-----------------   |
| type          | union of drivers connection options |
| default       | --                    |
| commands      | `migrate` `push` `pull`   |

<rem025/>

<CodeTabs items={["PostgreSQL", "MySQL", "SQLite", "Turso", "Cloudflare D1", "AWS Data API", "PGLite"]}>
<Section>
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://user:password@host:port/db",
  }
});
```
```ts
import { defineConfig } from 'drizzle-kit'

// via connection params
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    host: "host",
    port: 5432,
    user: "user",
    password: "password",
    database: "dbname",
    ssl: true, // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
  }
});
```
</Section>
<Section>
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://user:password@host:port/db",
  }
});
```
```ts
import { defineConfig } from 'drizzle-kit'

// via connection params
export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    host: "host",
    port: 5432,
    user: "user",
    password: "password",
    database: "dbname",
    ssl: "...", // can be: string | SslOptions (ssl options from mysql2 package)
  }
});
```
</Section>
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: ":memory:", // inmemory database
    // or
    url: "sqlite.db", 
    // or
    url: "file:sqlite.db" // file: prefix is required by libsql
  }
});
```
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: "libsql://acme.turso.io" // remote Turso database url
    authToken: "...",

    // or if you need local db

    url: ":memory:", // inmemory database
    // or
    url: "file:sqlite.db", // file: prefix is required by libsql
  }
});
```
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: "",
    databaseId: "",
    token: "",
  }
});
```
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: {
    database: "database",
    resourceArn: "resourceArn",
    secretArn: "secretArn",
  },
});
```
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    url: "./database/", // database folder path
  }
});
```
</CodeTabs>

### `migrations`
<rem025/>

When running `drizzle-kit migrate` - drizzle will records about 
successfully applied migrations in your database in log table named `__drizzle_migrations` in `public` schema(PostgreSQL only).

`migrations` config options lets you change both migrations log `table` name and `schema`.

|               |                      |
| :------------ | :-----------------   |
| type          | `{ table: string, schema: string }` |
| default       | `{ table: "__drizzle_migrations", schema: "drizzle" }`                    |
| commands      | `migrate`   |

<rem025/>

```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  migrations: {
    table: 'my-migrations-table', // `__drizzle_migrations` by default
    schema: 'public', // used in PostgreSQL only, `drizzle` by default
  },
});
```

### `introspect`
<rem025/>

Configuration for `drizzle-kit pull` command.

`casing` is responsible for in-code column keys casing

|               |                      |
| :------------ | :-----------------   |
| type          | `{ casing: "preserve" \| "camel" }` |
| default       | `{ casing: "camel" }`                    |
| commands      | `pull`   |

<rem025/>

<CodeTabs items={["camel", "preserve"]}>
<Section>
```ts
import * as p from "drizzle-orm/pg-core"

export const users = p.pgTable("users", {
  id: p.serial(),
  firstName: p.text("first-name"),
  lastName: p.text("LastName"),
  email: p.text(),
  phoneNumber: p.text("phone_number"),
});
```
```sql
SELECT a.attname AS column_name, format_type(a.atttypid, a.atttypmod) as data_type FROM pg_catalog.pg_attribute a;
```
``` 
 column_name   | data_type        
---------------+------------------------
 id            | serial
 first-name    | text
 LastName      | text
 email         | text
 phone_number  | text
```
</Section>
<Section>
```ts
import * as p from "drizzle-orm/pg-core"

export const users = p.pgTable("users", {
  id: p.serial(),
  "first-name": p.text("first-name"),
  LastName: p.text("LastName"),
  email: p.text(),
  phone_number: p.text("phone_number"),
});
```
```sql
SELECT a.attname AS column_name, format_type(a.atttypid, a.atttypmod) as data_type FROM pg_catalog.pg_attribute a;
```
``` 
 column_name   | data_type        
---------------+------------------------
 id            | serial
 first-name    | text
 LastName      | text
 email         | text
 phone_number  | text
```
</Section>
</CodeTabs>


## --- 

### `tablesFilter`
<Callout>
If you want to run multiple projects with one database - check out [our guide](/docs/goodies#multi-project-schema).
</Callout>
<rem025/>
`drizzle-kit push` and `drizzle-kit pull` will by default manage all tables in `public` schema.
You can configure list of tables, schemas and extensions via `tablesFilters`, `schemaFilter` and `extensionFilters` options.

`tablesFilter` option lets you specify [`glob`](https://www.digitalocean.com/community/tools/glob?comments=true&glob=/**/*.js&matches=false&tests=//%20This%20will%20match%20as%20it%20ends%20with%20'.js'&tests=/hello/world.js&tests=//%20This%20won't%20match!&tests=/test/some/globs) 
based table names filter, e.g. `["users", "user_info"]` or `"user*"`

|               |                      |
| :------------ | :-----------------   |
| type          | `string` `string[]` |
| default       | --                    |
| commands      | `generate` `push` `pull`   |

<rem025/>
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  tablesFilter: ["users", "posts", "project1_*"],
});
```

### `schemaFilter`

Was changed starting from `1.0.0-beta.1` version!

<Callout type='warning' collapsed="How it works in 0.x versions">
`drizzle-kit push` and `drizzle-kit pull` will by default manage all tables in `public` schema.
You can configure list of tables, schemas and extensions via `tablesFilters`, `schemaFilter` and `extensionFilters` options.

`schemaFilter` option lets you specify list of schemas for Drizzle Kit to manage

|               |                      |
| :------------ | :-----------------   |
| type          | `string[]` |
| default       | `["public"]`                    |
| commands      | `push` `pull`   |

</Callout>

<Callout>
If you want to run multiple projects with one database - check out [our guide](/docs/goodies#multi-project-schema).
</Callout>

`drizzle-kit push` and `drizzle-kit pull` will by default manage all schemas.

`schemaFilter` option lets you specify [`glob`](https://www.digitalocean.com/community/tools/glob?comments=true&glob=/**/*.js&matches=false&tests=//%20This%20will%20match%20as%20it%20ends%20with%20'.js'&tests=/hello/world.js&tests=//%20This%20won't%20match!&tests=/test/some/globs) 
based schema names filter, e.g. `["public", "auth"]` or `"tenant_*"`

|               |                      |
| :------------ | :-----------------   |
| type          | `string[]` |
| commands      | `push` `pull`   |

<rem025/>

```ts
export default defineConfig({
  dialect: "postgresql",
  schemaFilter: ["public", "schema1", "schema2"],
});
```

### `extensionsFilters`
<rem025/>

Some extensions like [`postgis`](https://postgis.net/), when installed on the database, create its own tables in public schema. 
Those tables have to be ignored by `drizzle-kit push` or `drizzle-kit pull`.

`extensionsFilters` option lets you declare list of installed extensions for drizzle kit to ignore their tables in the schema.

|               |                      |
| :------------ | :-----------------   |
| type          | `["postgis"]` |
| default       | `[]`                    |
| commands      | `push` `pull`   |

<rem025/>

```ts
export default defineConfig({
  dialect: "postgresql",
  extensionsFilters: ["postgis"],
});
```

## ---

### `entities`

This configuration is created to set up management settings for specific `entities` in the database. 

For now, it only includes `roles`, but eventually all database entities will migrate here, such as `tables`, `schemas`, `extensions`, `functions`, `triggers`, etc

#### `roles`

<rem025/>

If you are using Drizzle Kit to manage your schema and especially the defined roles, there may be situations where you have some roles that are not defined in the Drizzle schema. 
In such cases, you may want Drizzle Kit to skip those `roles` without the need to write each role in your Drizzle schema and mark it with `.existing()`.

The `roles` option lets you:

- Enable or disable role management with Drizzle Kit.
- Exclude specific roles from management by Drizzle Kit.
- Include specific roles for management by Drizzle Kit.
- Enable modes for providers like `Neon` and `Supabase`, which do not manage their specific roles.
- Combine all the options above

|               |                       |
| :------------ | :-----------------    |
| type          | `boolean \| { provider: "neon" \| "supabase", include: string[], exclude: string[]}`|
| default       | `false`                  |
| commands      | `push` `pull` `generate` |

<rem025/>

By default, `drizzle-kit` won't manage roles for you, so you will need to enable that. in `drizzle.config.ts`
```ts
export default defineConfig({
  dialect: "postgresql",
  entities: {
    roles: true
  }
});
```

**You have a role `admin` and want to exclude it from the list of manageable roles**

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

**You have a role `admin` and want to include to the list of manageable roles**

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

**If you are using `Neon` and want to exclude roles defined by `Neon`, you can use the provider option**

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

**If you are using `Supabase` and want to exclude roles defined by `Supabase`, you can use the provider option**

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
You may encounter situations where Drizzle is slightly outdated compared to new roles specified by database providers, 
so you may need to use both the `provider` option and `exclude` additional roles. You can easily do this with Drizzle:

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

## ---

### `strict`
<rem025/>

Prompts confirmation to run printed SQL statements when running `drizzle-kit push` command.

|               |                      |
| :------------ | :-----------------   |
| type          | `boolean` |
| default       | `false`                    |
| commands      | `push`   |

<rem025/>

```ts
export default defineConfig({
  dialect: "postgresql",
  strict: false,
});
```

### `verbose`
<rem025/>

Print all SQL statements during `drizzle-kit push` command.

|               |                      |
| :------------ | :-----------------   |
| type          | `boolean` |
| default       | `true`                    |
| commands      | `generate` `pull`   |

<rem025/>

```ts
export default defineConfig({
  dialect: "postgresql",
  verbose: false,
});
```

### `breakpoints`
<rem025/>

Drizzle Kit will automatically embed `--> statement-breakpoint` into generated SQL migration files, 
that's necessary for databases that do not support multiple DDL alternation statements in one transaction(MySQL and SQLite).

`breakpoints` option flag lets you switch it on and off

|               |                      |
| :------------ | :-----------------   |
| type          | `boolean` |
| default       | `true`                    |
| commands      | `generate` `pull`   |

<rem025/>

```ts
export default defineConfig({
  dialect: "postgresql",
  breakpoints: false,
});
```


Source: https://orm.drizzle.team/docs/drizzle-kit-check

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import Npm from "@mdx/Npm.astro";
import Npx from "@mdx/Npx.astro";


# `drizzle-kit check`

<Prerequisites>
- Get started with Drizzle and `drizzle-kit` - [read here](/docs/get-started)
- Drizzle schema fundamentals - [read here](/docs/sql-schema-declaration)
- Database connection basics - [read here](/docs/connect-overview)
- Drizzle migrations fundamentals - [read here](/docs/migrations)
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file)
- `drizzle-kit generate` command - [read here](/docs/drizzle-kit-generate)
</Prerequisites>

`drizzle-kit check` command lets you check consistency of your generated SQL migrations history.

That's extremely useful when you have multiple developers working on the project and 
altering database schema on different branches - read more about [migrations for teams](/docs/kit-migrations-for-teams).

<br/>
<hr/>
<br/>

`drizzle-kit check` command requires you to specify both `dialect` and database connection credentials, 
you can provide them either via [drizzle.config.ts](/docs/drizzle-config-file) config file or via CLI options

<CodeTabs items={["With config file", "As CLI options"]}>
<Section>
```ts {5,8}
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit check
```
</Section>
```shell
npx drizzle-kit check --dialect=postgresql
```
</CodeTabs>

### Multiple configuration files in one project
You can have multiple config files in the project, it's very useful when you have multiple database stages or multiple databases on the same project:
<Npx>
  drizzle-kit migrate --config=drizzle-dev.config.ts
  drizzle-kit migrate --config=drizzle-prod.config.ts
</Npx>
```plaintext {5-6}
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Extended list of configurations
We recommend configuring `drizzle-kit` through [drizzle.config.ts](/docs/drizzle-config-file) file, 
yet you can provide all configuration options through CLI if necessary, e.g. in CI/CD pipelines, etc.
<rem025/>
|           |            |                                                                         |
| :-------- | :--------- | :---------------------------------------------------------------------- |
| `dialect` | `required` | Database dialect you are using. Can be `postgresql`,`mysql` or `sqlite` |
| `out`     |            | Migrations folder, default=`./drizzle`                                  |
| `config`  |            | Configuration file path, default=`drizzle.config.ts`                           |
<br/>
<Npx>
drizzle-kit check --dialect=postgresql
drizzle-kit check --dialect=postgresql --out=./migrations-folder
</Npx>


Source: https://orm.drizzle.team/docs/drizzle-kit-export

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import Prerequisites from "@mdx/Prerequisites.astro"
import Npx from "@mdx/Npx.astro";
import SchemaFilePaths from "@mdx/SchemaFilePaths.mdx"
import Dialects from "@mdx/Dialects.mdx"

# `drizzle-kit export` 

<Prerequisites>
- Get started with Drizzle and `drizzle-kit` - [read here](/docs/get-started)
- Drizzle schema fundamentals - [read here](/docs/sql-schema-declaration)
- Database connection basics - [read here](/docs/connect-overview)
- Drizzle migrations fundamentals - [read here](/docs/migrations)
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file)
</Prerequisites>


<br/>

`drizzle-kit export` lets you export SQL representation of Drizzle schema and print in console SQL DDL representation on it.
<Callout collapsed="How it works under the hood?">
Drizzle Kit `export` command triggers a sequence of events:
1. It will read through your Drizzle schema file(s) and compose a json snapshot of your schema
3. Based on json differences it will generate SQL DDL statements
4. Output SQL DDL statements to console
</Callout>

It's designed to cover [codebase first](/docs/migrations) approach of managing Drizzle migrations. 
You can export the SQL representation of the Drizzle schema, allowing external tools like Atlas to handle all the migrations for you

`drizzle-kit export` command requires you to provide both `dialect` and `schema` path options, 
you can set them either via [drizzle.config.ts](/docs/drizzle-config-file) config file or via CLI options
<CodeTabs items={["With config file", "As CLI options"]}>
<Section>
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```
```shell
npx drizzle-kit export
```
</Section>

```shell
npx drizzle-kit export --dialect=postgresql --schema=./src/schema.ts
```
</CodeTabs>

### Schema files path
You can have a single `schema.ts` file or as many schema files as you want spread out across the project. 
Drizzle Kit requires you to specify path(s) to them as a [glob](https://www.digitalocean.com/community/tools/glob?comments=true&glob=/**/*.js&matches=false&tests=//%20This%20will%20match%20as%20it%20ends%20with%20'.js'&tests=/hello/world.js&tests=//%20This%20won't%20match!&tests=/test/some/globs) via `schema` configuration option.

<SchemaFilePaths/>

### Multiple configuration files in one project
You can have multiple config files in the project, it's very useful when you have multiple database stages or multiple databases or different databases on the same project:
<Npx>
  drizzle-kit export --config=drizzle-dev.config.ts
  drizzle-kit export --config=drizzle-prod.config.ts
</Npx>
```plaintext {5-6}
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Extended list of available configurations
`drizzle-kit export` has a list of cli-only options

<rem025/>

|               |                                                      |
| :--------     | :--------------------------------------------------- |
| `--sql`       | generating SQL representation of Drizzle Schema               |

By default, Drizzle Kit outputs SQL files, but in the future, we want to support different formats

<rem025/>

<Npx>
drizzle-kit push --name=init
drizzle-kit push --name=seed_users --custom
</Npx>

<br/>
<hr/>
<br/>
We recommend configuring `drizzle-kit` through [drizzle.config.ts](/docs/drizzle-config-file) file, 
yet you can provide all configuration options through CLI if necessary, e.g. in CI/CD pipelines, etc.

|               |            |                                                                            |
| :------------ | :-------   | :----------------------------------------------------------------------    |
| `dialect`     | `required` | Database dialect, one of <Dialects/>                                       |
| `schema`      | `required` | Path to typescript schema file(s) or folder(s) with multiple schema files  |
| `config`      |            | Configuration file path, default is `drizzle.config.ts`                    |

### Example
Example of how to export drizzle schema to console with Drizzle schema located in `./src/schema.ts`

We will also place drizzle config file in the `configs` folder.

Let's create config file:

```plaintext {4}
📦 <project root>
 ├ 📂 configs
 │ └ 📜 drizzle.config.ts
 ├ 📂 src
 │ └ 📜 schema.ts
 └ …
```
```ts filename='drizzle.config.ts'
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

```ts filename='schema.ts'
import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull(),
	name: text('name')
});
```

Now let's run
```shell
npx drizzle-kit export --config=./configs/drizzle.config.ts
```
And it will successfully output SQL representation of drizzle schema
```bash
CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "name" text
);
```

Source: https://orm.drizzle.team/docs/drizzle-kit-generate

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import Prerequisites from "@mdx/Prerequisites.astro"
import Npx from "@mdx/Npx.astro";
import SchemaFilePaths from "@mdx/SchemaFilePaths.mdx"
import Dialects from "@mdx/Dialects.mdx"

# `drizzle-kit generate` 

<Prerequisites>
- Get started with Drizzle and `drizzle-kit` - [read here](/docs/get-started)
- Drizzle schema fundamentals - [read here](/docs/sql-schema-declaration)
- Database connection basics - [read here](/docs/connect-overview)
- Drizzle migrations fundamentals - [read here](/docs/migrations)
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file)
</Prerequisites>


<br/>

`drizzle-kit generate` lets you generate SQL migrations based on your Drizzle schema upon declaration or on subsequent schema changes.
<Callout collapsed="How it works under the hood?">
Drizzle Kit `generate` command triggers a sequence of events:
1. It will read through your Drizzle schema file(s) and compose a json snapshot of your schema
2. It will read through your previous migrations folders and compare current json snapshot to the most recent one
3. Based on json differences it will generate SQL migrations
4. Save `migration.sql` and `snapshot.json` in migration folder under current timestamp

<Section>
```typescript filename="src/schema.ts"
import * as p from "./drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(), 
};
```
```                                  
┌────────────────────────┐                  
│ $ drizzle-kit generate │                  
└─┬──────────────────────┘                  
  │                                           
  └ 1. read previous migration folders
    2. find diff between current and previous schema
    3. prompt developer for renames if necessary
  ┌ 4. generate SQL migration and persist to file
  │    ┌─┴───────────────────────────────────────┐  
  │      📂 drizzle       
  │      └ 📂 20242409125510_premium_mister_fear
  │        ├ 📜 migration.sql
  │        └ 📜 snapshot.json
  v
```
```sql
-- drizzle/20242409125510_premium_mister_fear/migration.sql

CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```
</Section>
</Callout>

It's designed to cover [code first](/docs/migrations) approach of managing Drizzle migrations. 
You can apply generated migrations using [`drizzle-kit migrate`](/docs/drizzle-kit-migrate), using drizzle-orm's `migrate()`, 
using external migration tools like [bytebase](https://www.bytebase.com/) or running migrations yourself directly on the database. 

`drizzle-kit generate` command requires you to provide both `dialect` and `schema` path options, 
you can set them either via [drizzle.config.ts](/docs/drizzle-config-file) config file or via CLI options
<CodeTabs items={["With config file", "As CLI options"]}>
<Section>
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```
```shell
npx drizzle-kit generate
```
</Section>

```shell
npx drizzle-kit generate --dialect=postgresql --schema=./src/schema.ts
```
</CodeTabs>

### Schema files path
You can have a single `schema.ts` file or as many schema files as you want spread out across the project. 
Drizzle Kit requires you to specify path(s) to them as a [glob](https://www.digitalocean.com/community/tools/glob?comments=true&glob=/**/*.js&matches=false&tests=//%20This%20will%20match%20as%20it%20ends%20with%20'.js'&tests=/hello/world.js&tests=//%20This%20won't%20match!&tests=/test/some/globs) via `schema` configuration option.

<SchemaFilePaths/>


### Custom migration file name
You can set custom migration file names by providing `--name` CLI option
```shell
npx drizzle-kit generate --name=init
```
```plaintext {4}
📦 <project root>
 ├ 📂 drizzle
 │ └ 📂 20242409125510_init
 │   ├ 📜 snapshot.json
 │   └ 📜 migration.sql
 ├ 📂 src
 └ …
```

### Multiple configuration files in one project
You can have multiple config files in the project, it's very useful when you have multiple database stages or multiple databases or different databases on the same project:
<Npx>
  drizzle-kit generate --config=drizzle-dev.config.ts
  drizzle-kit generate --config=drizzle-prod.config.ts
</Npx>
```plaintext {5-6}
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Custom migrations
You can generate empty migration files to write your own custom SQL migrations 
for DDL alternations currently not supported by Drizzle Kit or data seeding. Extended docs on custom migrations - [see here](/docs/kit-custom-migrations)

```shell
drizzle-kit generate --custom --name=seed-users
```
<Section>
```plaintext {5}
📦 <project root>
 ├ 📂 drizzle
 │ ├ 📂 20242409125510_init
 │ └ 📂 20242409125510_seed-users
 ├ 📂 src
 └ …
```
```sql
-- ./drizzle/20242409125510_seed/migration.sql

INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
INSERT INTO "users" ("name") VALUES('Dandrew');
```
</Section>

### Extended list of available configurations
`drizzle-kit generate` has a list of cli-only options

<rem025/>

|               |                                                      |
| :--------     | :--------------------------------------------------- |
| `custom`      | generate empty SQL for custom migration              |
| `name`        | generate migration with custom name                  |

<rem025/>

<Npx>
drizzle-kit generate --name=init
drizzle-kit generate --name=seed_users --custom
</Npx>

<br/>
<hr/>
<br/>
We recommend configuring `drizzle-kit` through [drizzle.config.ts](/docs/drizzle-config-file) file, 
yet you can provide all configuration options through CLI if necessary, e.g. in CI/CD pipelines, etc.

|               |            |                                                                            |
| :------------ | :-------   | :----------------------------------------------------------------------    |
| `dialect`     | `required` | Database dialect, one of <Dialects/>                                       |
| `schema`      | `required` | Path to typescript schema file(s) or folder(s) with multiple schema files  |
| `out`         |            | Migrations output folder, default is `./drizzle`                           |
| `config`      |            | Configuration file path, default is `drizzle.config.ts`                    |
| `breakpoints` |            | SQL statements breakpoints, default is `true`                              |


### Extended example
Example of how to create a custom postgresql migration file named `0001_seed-users.sql` 
with Drizzle schema located in `./src/schema.ts` and migrations folder named `./migrations` instead of default `./drizzle`.

We will also place drizzle config file in the `configs` folder.

Let's create config file:

```plaintext {4}
📦 <project root>
 ├ 📂 migrations
 ├ 📂 configs
 │ └ 📜 drizzle.config.ts
 ├ 📂 src
 └ …
```
```ts filename='drizzle.config.ts'
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
});
```

Now let's run
```shell
npx drizzle-kit generate --config=./configs/drizzle.config.ts --name=seed-users --custom
```
And it will successfully generate
<Section>
```plaintext {6}
📦 <project root>
 ├ …
 ├ 📂 migrations
 │ ├ 📂 20242409125510_init
 │ └ 📂 20242409125510_seed-users
 └ …
```
```sql
-- ./drizzle/20242409125510_seed-users/migration.sql

INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
INSERT INTO "users" ("name") VALUES('Dandrew');
```
</Section>


Source: https://orm.drizzle.team/docs/drizzle-kit-migrate

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import Npx from "@mdx/Npx.astro";

# `drizzle-kit migrate`
<Prerequisites>
- Get started with Drizzle and `drizzle-kit` - [read here](/docs/get-started)
- Drizzle schema fundamentals - [read here](/docs/sql-schema-declaration)
- Database connection basics - [read here](/docs/connect-overview)
- Drizzle migrations fundamentals - [read here](/docs/migrations)
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file)
- `drizzle-kit generate` command - [read here](/docs/drizzle-kit-generate)
</Prerequisites>
<br/>


`drizzle-kit migrate` lets you apply SQL migrations generated by [`drizzle-kit generate`](/docs/drizzle-kit-generate). 
It's designed to cover [code first(option 3)](/docs/migrations) approach of managing Drizzle migrations. 

<Callout collapsed="How it works under the hood?">
Drizzle Kit `migrate` command triggers a sequence of events:
1. Reads through migration folder and read all `.sql` migration files
2. Connects to the database and fetches entries from drizzle migrations log table
3. Based on previously applied migrations it will decide which new migrations to run
4. Runs SQL migrations and logs applied migrations to drizzle migrations table

<Section>
```plaintext
  ├ 📂 drizzle       
  │ ├ 📂 20242409125510_premium_mister_fear
  │ └ 📂 20242409135510_delicate_professor_xavie
  └ …
```
```plaintext
┌───────────────────────┐                  
│ $ drizzle-kit migrate │                  
└─┬─────────────────────┘                  
  │                                                         ┌──────────────────────────┐                                         
  └ 1. reads migration.sql files in migrations folder       │                          │
    2. fetch migration history from database -------------> │                          │
  ┌ 3. pick previously unapplied migrations <-------------- │         DATABASE         │
  └ 4. apply new migration to the database ---------------> │                          │
                                                            │                          │
                                                            └──────────────────────────┘
[✓] done!        
```
</Section>
</Callout>

`drizzle-kit migrate` command requires you to specify both `dialect` and database connection credentials, 
you can provide them either via [drizzle.config.ts](/docs/drizzle-config-file) config file or via CLI options

<CodeTabs items={["With config file", "As CLI options"]}>
<Section>
```ts {5,8}
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```
```shell
npx drizzle-kit migrate
```
</Section>
```shell
npx drizzle-kit migrate --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```
</CodeTabs>

### Applied migrations log in the database
Upon running migrations Drizzle Kit will persist records about successfully applied migrations in your database. 
It will store them in migrations log table named `__drizzle_migrations`.

You can customise both **table** and **schema**(PostgreSQL only) of that table via drizzle config file:
```ts filename="drizzle.config.ts" {8-9}
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
  migrations: {
    table: 'my-migrations-table', // `__drizzle_migrations` by default
    schema: 'public', // used in PostgreSQL only, `drizzle` by default
  },
});
```

### Multiple configuration files in one project
You can have multiple config files in the project, it's very useful when you have multiple database stages or multiple databases on the same project:
<Npx>
  drizzle-kit migrate --config=drizzle-dev.config.ts
  drizzle-kit migrate --config=drizzle-prod.config.ts
</Npx>
```plaintext {5-6}
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Extended example
Let's generate SQL migration and apply it to our database using `drizzle-kit generate` and `drizzle-kit migrate` commands

```plaintext
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 │ ├ 📜 schema.ts
 │ └ 📜 index.ts
 ├ 📜 drizzle.config.ts
 └ …
```
<CodeTabs items={["drizzle.config.ts", "src/schema.ts"]}>
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
  migrations: {
    table: 'journal', 
    schema: 'drizzle', 
  },
});
```
```ts 
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```
</CodeTabs>

Now let's run
```shell
npx drizzle-kit generate --name=init
```
it will generate
<Section>
```plaintext {5}
📦 <project root>
 ├ …
 ├ 📂 migrations
 │ ├ 📂 20242409125510_init
 └ …
```
```sql
-- ./drizzle/0000_init.sql

CREATE TABLE "users"(
  id serial primary key,
  name text
)
```
</Section>

Now let's run
```shell
npx drizzle-kit migrate
```

and our SQL migration is now successfully applied to the database ✅


Source: https://orm.drizzle.team/docs/drizzle-kit-pull

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import Drivers from "@mdx/Drivers.mdx"
import Dialects from "@mdx/Dialects.mdx"
import Npm from "@mdx/Npm.astro"
import Npx from "@mdx/Npx.astro"

# `drizzle-kit pull`

<Prerequisites>
- Get started with Drizzle and `drizzle-kit` - [read here](/docs/get-started)
- Drizzle schema fundamentals - [read here](/docs/sql-schema-declaration) 
- Database connection basics - [read here](/docs/connect-overview) 
- Drizzle migrations fundamentals - [read here](/docs/migrations) 
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file) docs
</Prerequisites>

`drizzle-kit pull` lets you literally pull(introspect) your existing database schema and generate `schema.ts` drizzle schema file, 
it is designed to cover [database first](/docs/migrations) approach of Drizzle migrations.

<Callout collapsed="How it works under the hood?">
When you run Drizzle Kit `pull` command it will:
1. Pull database schema(DDL) from your existing database
2. Generate `schema.ts` drizzle schema file and save it to `out` folder

<Section>
```
                                  ┌────────────────────────┐      ┌─────────────────────────┐ 
                                  │                        │ <---  CREATE TABLE "users" (
┌──────────────────────────┐      │                        │        "id" SERIAL PRIMARY KEY,
│ ~ drizzle-kit pull       │      │                        │        "name" TEXT,
└─┬────────────────────────┘      │        DATABASE        │        "email" TEXT UNIQUE
  │                               │                        │       );
  └ Pull datatabase schema -----> │                        │
  ┌ Generate Drizzle       <----- │                        │
  │ schema TypeScript file        └────────────────────────┘
  │
  v
```
```typescript
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(), 
};
```
</Section>
</Callout>

It is a great approach if you need to manage database schema outside of your TypeScript project or 
you're using database, which is managed by somebody else.

<br/>
<hr/>
<br/>

`drizzle-kit pull` requires you to specify `dialect` and either
database connection `url` or `user:password@host:port/db` params, you can provide them
either via [drizzle.config.ts](/docs/drizzle-config-file) config file or via CLI options:

<CodeTabs items={["With config file", "With CLI options"]}>
<Section>
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```
```shell
npx drizzle-kit pull
```
</Section>

```shell
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```
</CodeTabs>

### Multiple configuration files in one project

You can have multiple config files in the project, it's very useful when you have multiple database stages or multiple databases or different databases on the same project:

<Npx>
  drizzle-kit pull --config=drizzle-dev.config.ts
  drizzle-kit pull --config=drizzle-prod.config.ts
</Npx>
```plaintext {5-6}
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Specifying database driver
<Callout type="warning">
**Expo SQLite** and **OP SQLite** are on-device(per-user) databases, there's no way to `pull` database schema from there.<br/>
For embedded databases Drizzle provides **embedded migrations** - check out our [get started](/docs/get-started/expo-new) guide.
</Callout>
Drizzle Kit does not come with a pre-bundled database driver, 
it will automatically pick available database driver from your current project based on the `dialect` - [see discussion](https://github.com/drizzle-team/drizzle-orm/discussions/2203).

Mostly all drivers of the same dialect share the same set of connection params, 
as for exceptions like `aws-data-api`, `pglight` and `d1-http` - you will have to explicitely specify `driver` param.

<CodeTabs items={["AWS Data API", "PGLite", "Cloudflare D1 HTTP"]}>
```ts {6}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: {
    database: "database",
    resourceArn: "resourceArn",
    secretArn: "secretArn",
  },
};
```
```ts {6}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    // inmemory
    url: ":memory:"
    
    // or database folder
    url: "./database/"
  },
};
```
```ts {6}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: "accountId",
    databaseId: "databaseId",
    token: "token",
  },
};
```
</CodeTabs>

### Initial pull

<Callout type='error'>
This feature is available on  `1.0.0-beta.2` and higher.
</Callout>

<Npm>
drizzle-orm@beta
drizzle-kit@beta -D
</Npm>

<br/>

You can use the `--init` flag to mark the pulled schema as an applied migration in your database, 
so that all subsequent migrations are diffed against the initial one

```shell
npx drizzle-kit push --init
```

### Including tables, schemas and extensions
`drizzle-kit push` will by default manage all tables in `public` schema.
You can configure list of tables, schemas and extensions via `tablesFilters`, `schemaFilter` and `extensionFilters` options.

|                     |                                                                                               |
| :------------------ | :-------------------------------------------------------------------------------------------- |
| `tablesFilter`      | `glob` based table names filter, e.g. `["users", "user_info"]` or `"user*"`. Default is `"*"` |
| `schemaFilter`      | `glob` based schema names filter, e.g. `["public", "drizzle"]` or `"drizzle*"`. Default is `"*"`                     |
| `extensionsFilters` | List of installed database extensions, e.g. `["postgis"]`. Default is `[]`                    |
<br/>

Let's configure drizzle-kit to only operate with **all tables** in **public** schema
and let drizzle-kit know that there's a **postgis** extension installed, 
which creates it's own tables in public schema, so drizzle can ignore them.

<Section>
```ts filename="drizzle.config.ts" {9-11}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
```
```shell
npx drizzle-kit push
```
</Section>

### Extended list of configurations
We recommend configuring `drizzle-kit` through [drizzle.config.ts](/docs/drizzle-config-file) file, 
yet you can provide all configuration options through CLI if necessary, e.g. in CI/CD pipelines, etc.

|                     |            |                                                                           |
| :------------------ | :--------- | :------------------------------------------------------------------------ |
| `dialect`           | `required` | Database dialect, one of <Dialects/>                                      |
| `driver`            |            | Drivers exceptions <Drivers/>                                             |
| `out`               |            | Migrations output folder path, default is `./drizzle`                     |
| `url`               |            | Database connection string                                                |
| `user`              |            | Database user                                                             |
| `password`          |            | Database password                                                         |
| `host`              |            | Host                                                                      |
| `port`              |            | Port                                                                      |
| `database`          |            | Database name                                                             |
| `config`            |            | Configuration file path, default is `drizzle.config.ts`                          |
| `introspect-casing` |            | Strategy for JS keys creation in columns, tables, etc. `preserve` `camel` |
| `tablesFilter`      |            | Table name filter                                                         |
| `schemaFilter`      |            | Schema name filter. Default: `["public"]`                                 |
| `extensionsFilters` |            | Database extensions internal database filters                             |

<Npx>
drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
drizzle-kit pull --dialect=postgresql --driver=pglite url=database/
drizzle-kit pull --dialect=postgresql --tablesFilter='user*' --extensionsFilters=postgis url=postgresql://user:password@host:port/dbname
</Npx>

![](@/assets/gifs/introspect_mysql.gif)


Source: https://orm.drizzle.team/docs/drizzle-kit-push

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import Npx from "@mdx/Npx.astro";
import SchemaFilePaths from "@mdx/SchemaFilePaths.mdx";
import Drivers from "@mdx/Drivers.mdx"
import Dialects from "@mdx/Dialects.mdx"
import DriversExamples from "@mdx/DriversExamples.mdx"

# `drizzle-kit push`

<Prerequisites>
- Get started with Drizzle and `drizzle-kit` - [read here](/docs/get-started)
- Drizzle schema fundamentals - [read here](/docs/sql-schema-declaration) 
- Database connection basics - [read here](/docs/connect-overview) 
- Drizzle migrations fundamentals - [read here](/docs/migrations) 
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file) docs
</Prerequisites>


`drizzle-kit push` lets you literally push your schema and subsequent schema changes directly to the
database while omitting SQL files generation, it's designed to cover [code first](/docs/migrations)
approach of Drizzle migrations.

<Callout collapsed="How it works under the hood?">
When you run Drizzle Kit `push` command it will:
1. Read through your Drizzle schema file(s) and compose a json snapshot of your schema
2. Pull(introspect) database schema 
3. Based on differences between those two it will generate SQL migrations
4. Apply SQL migrations to the database

<Section>
```typescript filename="src/schema.ts"
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
};
```
```
┌─────────────────────┐                  
│ ~ drizzle-kit push  │                  
└─┬───────────────────┘                  
  │                                           ┌──────────────────────────┐
  └ Pull current datatabase schema ---------> │                          │
                                              │                          │
  ┌ Generate alternations based on diff <---- │         DATABASE         │
  │                                           │                          │
  └ Apply migrations to the database -------> │                          │
                                       │      └──────────────────────────┘
                                       │
  ┌────────────────────────────────────┴────────────────┐
   create table users(id serial primary key, name text);
```
</Section>
</Callout>

It's the best approach for rapid prototyping and we've seen dozens of teams
and solo developers successfully using it as a primary migrations flow in their production applications.
It pairs exceptionally well with blue/green deployment strategy and serverless databases like
[Planetscale](https://planetscale.com), [Neon](https://neon.tech), [Turso](https://turso.tech/drizzle) and others.

<br/>
<hr/>
<br/>


`drizzle-kit push` requires you to specify `dialect`, path to the `schema` file(s) and either
database connection `url` or `user:password@host:port/db` params, you can provide them
either via [drizzle.config.ts](/docs/drizzle-config-file) config file or via CLI options:

<CodeTabs items={["With config file", "With CLI options"]}>
<Section>
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```
```shell
npx drizzle-kit push
```
</Section>

```shell
npx drizzle-kit push --dialect=postgresql --schema=./src/schema.ts --url=postgresql://user:password@host:port/dbname
```

</CodeTabs>

### Schema files path

You can have a single `schema.ts` file or as many schema files as you want spread out across the project.
Drizzle Kit requires you to specify path(s) to them as a [glob](https://www.digitalocean.com/community/tools/glob?comments=true&glob=/**/*.js&matches=false&tests=//%20This%20will%20match%20as%20it%20ends%20with%20'.js'&tests=/hello/world.js&tests=//%20This%20won't%20match!&tests=/test/some/globs) via `schema` configuration option.

<SchemaFilePaths />

### Multiple configuration files in one project

You can have multiple config files in the project, it's very useful when you have multiple database stages or multiple databases or different databases on the same project:

<Npx>
  drizzle-kit push --config=drizzle-dev.config.ts
  drizzle-kit push --config=drizzle-prod.config.ts
</Npx>
```plaintext {5-6}
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Specifying database driver
<Callout type="warning">
**Expo SQLite** and **OP SQLite** are on-device(per-user) databases, there's no way to `push` migrations there.<br/>
For embedded databases Drizzle provides **embedded migrations** - check out our [get started](/docs/get-started/expo-new) guide.
</Callout>
Drizzle Kit does not come with a pre-bundled database driver, 
it will automatically pick available database driver from your current project based on the `dialect` - [see discussion](https://github.com/drizzle-team/drizzle-orm/discussions/2203).

Mostly all drivers of the same dialect share the same set of connection params, 
as for exceptions like `aws-data-api`, `pglight` and `d1-http` - you will have to explicitly specify `driver` param.

<DriversExamples/>

### Including tables, schemas and extensions
`drizzle-kit push` will by default manage all tables in `public` schema.
You can configure list of tables, schemas and extensions via `tablesFilters`, `schemaFilter` and `extensionFilters` options.

|                     |                                                                                               |
| :------------------ | :-------------------------------------------------------------------------------------------- |
| `tablesFilter`      | `glob` based table names filter, e.g. `["users", "user_info"]` or `"user*"`. Default is `"*"` |
| `schemaFilter`      | Schema names filter, e.g. `["public", "drizzle"]`. Default is `["public"]`                    |
| `extensionsFilters` | List of installed database extensions, e.g. `["postgis"]`. Default is `[]`                    |
<br/>

Let's configure drizzle-kit to only operate with **all tables** in **public** schema
and let drizzle-kit know that there's a **postgis** extension installed, 
which creates it's own tables in public schema, so drizzle can ignore them.

<Section>
```ts filename="drizzle.config.ts" {9-11}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
```
```shell
npx drizzle-kit push
```
</Section>

### Extended list of configurations

`drizzle-kit push` has a list of cli-only options

<rem025/>

|           |                                                          |
| :-------- | :---------------------------------------------------     |
| `verbose` | print all SQL statements prior to execution              |
| `strict`  | always ask for approval before executing SQL statements  |
| `force`   | auto-accept all data-loss statements                     |
<br/>
<Npx>
drizzle-kit push --strict --verbose --force
</Npx>

<br/>
<hr/>
<br/>
We recommend configuring `drizzle-kit` through [drizzle.config.ts](/docs/drizzle-config-file) file, 
yet you can provide all configuration options through CLI if necessary, e.g. in CI/CD pipelines, etc.

|                     |            |                                                                           |
| :------------------ | :--------- | :------------------------------------------------------------------------ |
| `dialect`           | `required` | Database dialect, one of <Dialects/>                                      |
| `schema`            | `required` | Path to typescript schema file(s) or folder(s) with multiple schema files |
| `driver`            |            | Drivers exceptions <Drivers/>                                             |
| `tablesFilter`      |            | Table name filter                                                         |
| `schemaFilter`      |            | Schema name filter. Default: `["public"]`                                 |
| `extensionsFilters` |            | Database extensions internal database filters                             |
| `url`               |            | Database connection string                                                |
| `user`              |            | Database user                                                             |
| `password`          |            | Database password                                                         |
| `host`              |            | Host                                                                      |
| `port`              |            | Port                                                                      |
| `database`          |            | Database name                                                             |
| `config`            |            | Configuration file path, default=`drizzle.config.ts`                             |

<Npx>
drizzle-kit push dialect=postgresql schema=src/schema.ts url=postgresql://user:password@host:port/dbname
drizzle-kit push dialect=postgresql schema=src/schema.ts driver=pglite url=database/
drizzle-kit push dialect=postgresql schema=src/schema.ts --tablesFilter='user*' --extensionsFilters=postgis url=postgresql://user:password@host:port/dbname
</Npx>


### Extended example
Let's declare drizzle schema in the project and push it to the database via `drizzle-kit push` command

```plaintext
📦 <project root>
 ├ 📂 src
 │ ├ 📜 schema.ts
 │ └ 📜 index.ts
 ├ 📜 drizzle.config.ts
 └ …
```
<CodeTabs items={["drizzle.config.ts", "src/schema.ts"]}>
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```
```ts 
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```
</CodeTabs>

Now let's run
```shell
npx drizzle-kit push
```

it will pull existing(empty) schema from the database and generate SQL migration and apply it under the hood
```sql
CREATE TABLE "users"(
  id serial primary key,
  name text
)
```

DONE ✅


Source: https://orm.drizzle.team/docs/drizzle-kit-studio

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import Npm from "@mdx/Npm.astro";
import Npx from "@mdx/Npx.astro";


# `drizzle-kit studio`
<Prerequisites>
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file)
- Drizzle Studio, our database browser - [read here](/drizzle-studio/overview)
</Prerequisites>

`drizzle-kit studio` command spins up a server for [Drizzle Studio](/drizzle-studio/overview) hosted on [local.drizzle.studio](https://local.drizzle.studio). 
It requires you to specify database connection credentials via [drizzle.config.ts](/docs/drizzle-config-file) config file.

By default it will start a Drizzle Studio server on `127.0.0.1:4983`
<Section>
```ts {6}
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```
```shell
npx drizzle-kit migrate
```
</Section>

### Configuring `host` and `port`
By default Drizzle Studio server starts on `127.0.0.1:4983`, 
you can config `host` and `port` via CLI options

<Npx>
drizzle-kit studio --port=3000
drizzle-kit studio --host=0.0.0.0
drizzle-kit studio --host=0.0.0.0 --port=3000
</Npx>


### Logging
You can enable logging of every SQL statement by providing `verbose` flag

<Npx>
drizzle-kit studio --verbose
</Npx>

### Safari and Brave support
Safari and Brave block access to localhost by default. 
You need to install [mkcert](https://github.com/FiloSottile/mkcert) and generate self-signed certificate:

1. Follow the mkcert [installation steps](https://github.com/FiloSottile/mkcert#installation)
2. Run `mkcert -install`
3. Restart your `drizzle-kit studio`

### Embeddable version of Drizzle Studio
While hosted version of Drizzle Studio for local development is free forever and meant to just enrich Drizzle ecosystem, 
we have a B2B offering of an embeddable version of Drizzle Studio for businesses.

**Drizzle Studio component** - is a pre-bundled framework agnostic web component of Drizzle Studio 
which you can embed into your UI `React` `Vue` `Svelte` `VanillaJS` etc. 

That is an extremely powerful UI element that can elevate your offering 
if you provide Database as a SaaS or a data centric SaaS solutions based 
on SQL or for private non-customer facing in-house usage.

Database platforms using Drizzle Studio:
- [Turso](https://turso.tech/), our first customers since Oct 2023!
- [Neon](https://neon.tech/), [launch post](https://neon.tech/docs/changelog/2024-05-24)
- [Hydra](https://www.hydra.so/)

Data centric platforms using Drizzle Studio:
- [Nuxt Hub](https://hub.nuxt.com/), Sébastien Chopin's [launch post](https://x.com/Atinux/status/1768663789832929520)
- [Deco.cx](https://deco.cx/)

You can read a detailed overview [here](https://www.npmjs.com/package/@drizzle-team/studio) and 
if you're interested - hit us in DMs on [Twitter](https://x.com/drizzleorm) or in [Discord #drizzle-studio](https://driz.link/discord) channel.

### Drizzle Studio chrome extension
Drizzle Studio [chrome extension](https://chromewebstore.google.com/detail/drizzle-studio/mjkojjodijpaneehkgmeckeljgkimnmd) 
lets you browse your [PlanetScale](https://planetscale.com), 
[Cloudflare](https://developers.cloudflare.com/d1/) and [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
serverless databases directly in their vendor admin panels!

### Limitations
Our hosted version Drizzle Studio is meant to be used for local development and not meant to be used on remote (VPS, etc).

If you want to deploy Drizzle Studio to your VPS - we have an alpha version of Drizzle Studio Gateway, 
hit us in DMs on [Twitter](https://x.com/drizzleorm) or in [Discord #drizzle-studio](https://driz.link/discord) channel.

### Is it open source?
No. Drizzle ORM and Drizzle Kit are fully open sourced, while Studio is not. 

Drizzle Studio for local development is free to use forever to enrich Drizzle ecosystem, 
open sourcing one would've break our ability to provide B2B offerings and monetise it, unfortunately.


Source: https://orm.drizzle.team/docs/drizzle-kit-up

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import Npx from "@mdx/Npx.astro";

# `drizzle-kit up`

<Prerequisites>
- Get started with Drizzle and `drizzle-kit` - [read here](/docs/get-started)
- Drizzle schema fundamentals - [read here](/docs/sql-schema-declaration)
- Database connection basics - [read here](/docs/connect-overview)
- Drizzle migrations fundamentals - [read here](/docs/migrations)
- Drizzle Kit [overview](/docs/kit-overview) and [config file](/docs/drizzle-config-file)
- `drizzle-kit generate` command - [read here](/docs/drizzle-kit-generate)
</Prerequisites>

`drizzle-kit up` command lets you upgrade drizzle schema snapshots to a newer version. 
It's required whenever we introduce breaking changes to the json snapshots of the schema and upgrade the internal version.

<br/>
<hr/>
<br/>

`drizzle-kit up` command requires you to specify both `dialect` and database connection credentials, 
you can provide them either via [drizzle.config.ts](/docs/drizzle-config-file) config file or via CLI options

<CodeTabs items={["With config file", "As CLI options"]}>
<Section>
```ts {5,8}
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit up
```
</Section>
```shell
npx drizzle-kit up --dialect=postgresql
```
</CodeTabs>

### Multiple configuration files in one project
You can have multiple config files in the project, it's very useful when you have multiple database stages or multiple databases on the same project:
<Npx>
  drizzle-kit migrate --config=drizzle-dev.config.ts
  drizzle-kit migrate --config=drizzle-prod.config.ts
</Npx>
```plaintext {5-6}
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### Extended list of configurations
We recommend configuring `drizzle-kit` through [drizzle.config.ts](/docs/drizzle-config-file) file, 
yet you can provide all configuration options through CLI if necessary, e.g. in CI/CD pipelines, etc.
<rem025/>
|           |            |                                                                         |
| :-------- | :--------- | :---------------------------------------------------------------------- |
| `dialect` | `required` | Database dialect you are using. Can be `postgresql`,`mysql` or `sqlite` |
| `out`     |            | Migrations folder, default=`./drizzle`                                  |
| `config`  |            | Configuration file path, default=`drizzle.config.ts`                           |
<br/>
<Npx>
drizzle-kit up --dialect=postgresql
drizzle-kit up --dialect=postgresql --out=./migrations-folder
</Npx>

![](@/assets/gifs/up_mysql.gif)



Source: https://orm.drizzle.team/docs/dynamic-query-building

import Callout from '@mdx/Callout.astro';

# Dynamic query building

By default, as all the query builders in Drizzle try to conform to SQL as much as possible, you can only invoke most of the methods once.
For example, in a `SELECT` statement there might only be one `WHERE` clause, so you can only invoke `.where()` once:

```ts
const query = db
	.select()
	.from(users)
	.where(eq(users.id, 1))
	.where(eq(users.name, 'John')); // ❌ Type error - where() can only be invoked once
```

In the previous ORM versions, when such restrictions weren't implemented, this example in particular was a source of confusion for many users, as they expected the query builder to "merge" multiple `.where()` calls into a single condition.

This behavior is useful for conventional query building, i.e. when you create the whole query at once.
However, it becomes a problem when you want to build a query dynamically, i.e. if you have a shared function that takes a query builder and enhances it.
To solve this problem, Drizzle provides a special 'dynamic' mode for query builders, which removes the restriction of invoking methods only once.
To enable it, you need to call `.$dynamic()` on a query builder.

Let's see how it works by implementing a simple `withPagination` function that adds `LIMIT` and `OFFSET` clauses to a query based on the provided page number and an optional page size:

```ts
function withPagination<T extends PgSelect>(
	qb: T,
	page: number = 1,
	pageSize: number = 10,
) {
	return qb.limit(pageSize).offset((page - 1) * pageSize);
}

const query = db.select().from(users).where(eq(users.id, 1));
withPagination(query, 1); // ❌ Type error - the query builder is not in dynamic mode

const dynamicQuery = query.$dynamic();
withPagination(dynamicQuery, 1); // ✅ OK
```

Note that the `withPagination` function is generic, which allows you to modify the result type of the query builder inside it, for example by adding a join:

```ts
function withFriends<T extends PgSelect>(qb: T) {
	return qb.leftJoin(friends, eq(friends.userId, users.id));
}

let query = db.select().from(users).where(eq(users.id, 1)).$dynamic();
query = withFriends(query);
```

This is possible, because `PgSelect` and other similar types are specifically designed to be used in dynamic query building. They can only be used in dynamic mode.

Here is the list of all types that can be used as generic parameters in dynamic query building:

{

<table>
	<thead align='center'>
		<tr>
			<td>
				<b>Dialect</b>
			</td>
			<td colspan='4'>
				<b>Type</b>
			</td>
		</tr>
		<tr>
			<td>
				<b>Query</b>
			</td>
			<td>
				<b>Select</b>
			</td>
			<td>
				<b>Insert</b>
			</td>
			<td>
				<b>Update</b>
			</td>
			<td>
				<b>Delete</b>
			</td>
		</tr>
	</thead>
	<tbody>
		<tr align='center'>
			<td rowspan='2'>Postgres</td>
			<td>
				<code>PgSelect</code>
			</td>
			<td rowspan='2'>
				<code>PgInsert</code>
			</td>
			<td rowspan='2'>
				<code>PgUpdate</code>
			</td>
			<td rowspan='2'>
				<code>PgDelete</code>
			</td>
		</tr>
		<tr align='center'>
			<td>
				<code>PgSelectQueryBuilder</code>
			</td>
		</tr>
		<tr align='center'>
			<td rowspan='2'>MySQL</td>
			<td>
				<code>MySqlSelect</code>
			</td>
			<td rowspan='2'>
				<code>MySqlInsert</code>
			</td>
			<td rowspan='2'>
				<code>MySqlUpdate</code>
			</td>
			<td rowspan='2'>
				<code>MySqlDelete</code>
			</td>
		</tr>
		<tr align='center'>
			<td>
				<code>MySqlSelectQueryBuilder</code>
			</td>
		</tr>
		<tr align='center'>
			<td rowspan='2'>SQLite</td>
			<td>
				<code>SQLiteSelect</code>
			</td>
			<td rowspan='2'>
				<code>SQLiteInsert</code>
			</td>
			<td rowspan='2'>
				<code>SQLiteUpdate</code>
			</td>
			<td rowspan='2'>
				<code>SQLiteDelete</code>
			</td>
		</tr>
		<tr align='center'>
			<td>
				<code>SQLiteSelectQueryBuilder</code>
			</td>
		</tr>
	</tbody>
</table>

}

<Callout type='info'>
	The `...QueryBuilder` types are for usage with [standalone query builder
	instances](/docs/goodies#standalone-query-builder). DB query builders are
	subclasses of them, so you can use them as well.

    ```ts
    	import { QueryBuilder } from 'drizzle-orm/pg-core';

    	function withFriends<T extends PgSelectQueryBuilder>(qb: T) {
    		return qb.leftJoin(friends, eq(friends.userId, users.id));
    	}

    	const qb = new QueryBuilder();
    	let query = qb.select().from(users).where(eq(users.id, 1)).$dynamic();
    	query = withFriends(query);
    ```

</Callout>


Source: https://orm.drizzle.team/docs/eslint-plugin

import Tabs from '@mdx/Tabs.astro';
import Tab from '@mdx/Tab.astro';
import Npm from '@mdx/Npm.astro';

# ESLint Drizzle Plugin

For cases where it's impossible to perform type checks for specific scenarios, or where it's possible but error messages would be challenging to understand, we've decided to create an ESLint package with recommended rules. This package aims to assist developers in handling crucial scenarios during development

## Install

<Npm>
eslint-plugin-drizzle
@typescript-eslint/eslint-plugin @typescript-eslint/parser
</Npm>

## Usage

**`.eslintrc.yml` example**
```yml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

**All config**

This plugin exports an `all` that makes use of all rules (except for deprecated ones).

```yml
root: true
extends:
  - "plugin:drizzle/all"
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
```

**Recommended config**

At the moment, `all` is equivalent to `recommended`

```yml
root: true
extends:
  - "plugin:drizzle/recommended"
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
```

## Rules

### **enforce-delete-with-where**

Enforce using `delete` with the`.where()` clause in the `.delete()` statement. Most of the time, 
you don't need to delete all rows in the table and require some kind of `WHERE` statements.

Optionally, you can define a `drizzleObjectName` in the plugin options that accept a `string` or
`string[]`. This is useful when you have objects or classes with a delete method that's not from
Drizzle. Such a `delete` method will trigger the ESLint rule. To avoid that, you can define the 
name of the Drizzle object that you use in your codebase (like db) so that the rule would only 
trigger if the delete method comes from this object:

Example, config 1:
```yml
rules:
  'drizzle/enforce-delete-with-where': "error"
```

```ts
class MyClass {
  public delete() {
    return {}
  }
}

const myClassObj = new MyClass();

// ---> Will be triggered by ESLint Rule
myClassObj.delete()

const db = drizzle(...)
// ---> Will be triggered by ESLint Rule
db.delete()
```

Example, config 2:
```yml
rules:
  'drizzle/enforce-delete-with-where':
    - "error"
    - "drizzleObjectName": 
      - "db"
```
```ts
class MyClass {
  public delete() {
    return {}
  }
}

const myClassObj = new MyClass();

// ---> Will NOT be triggered by ESLint Rule
myClassObj.delete()

const db = drizzle(...)
// ---> Will be triggered by ESLint Rule
db.delete()
```

### **enforce-update-with-where**: 

Enforce using `update` with the`.where()` clause in the `.update()` statement. 
Most of the time, you don't need to update all rows in the table and require 
some kind of `WHERE` statements.

Optionally, you can define a `drizzleObjectName` in the plugin options that accept 
a `string` or `string[]`. This is useful when you have objects or classes with a delete 
method that's not from Drizzle. Such as `update` method will trigger the ESLint rule. To 
avoid that, you can define the name of the Drizzle object that you use in your codebase (like db) 
so that the rule would only trigger if the delete method comes from this object:

Example, config 1:
```yml
rules:
  'drizzle/enforce-update-with-where': "error"
```

```ts
class MyClass {
  public update() {
    return {}
  }
}

const myClassObj = new MyClass();

// ---> Will be triggered by ESLint Rule
myClassObj.update()

const db = drizzle(...)
// ---> Will be triggered by ESLint Rule
db.update()
```

Example, config 2:
```yml
rules:
  'drizzle/enforce-update-with-where':
    - "error"
    - "drizzleObjectName": 
      - "db"
```
```ts
class MyClass {
  public update() {
    return {}
  }
}

const myClassObj = new MyClass();

// ---> Will NOT be triggered by ESLint Rule
myClassObj.update()

const db = drizzle(...)
// ---> Will be triggered by ESLint Rule
db.update()
```

Source: https://orm.drizzle.team/docs/extensions/mysql


import Callout from '@mdx/Callout.astro';

<Callout>
Currently, there are no MySQL extensions natively supported by Drizzle. Once those are added, we will have them here!
</Callout>

Source: https://orm.drizzle.team/docs/extensions/pg


import Callout from '@mdx/Callout.astro';
import Section from '@mdx/Section.astro';

### `pg_vector`

<Callout>
There is no specific code to create an extension inside the Drizzle schema. We assume that if you are using vector types, 
indexes, and queries, you have a PostgreSQL database with the pg_vector extension installed.
</Callout>

[`pg_vector`](https://github.com/pgvector/pgvector) is open-source vector similarity search for Postgres

Store your vectors with the rest of your data. Supports:

- exact and approximate nearest neighbor search
- single-precision, half-precision, binary, and sparse vectors
- L2 distance, inner product, cosine distance, L1 distance, Hamming distance, and Jaccard distance

#### Column Types

**`vector`**

Store your vectors with the rest of your data

For more info please refer to the official pg_vector docs **[docs.](https://github.com/pgvector/pgvector)**


<Section>
```ts
const table = pgTable('table', {
    embedding: vector({ dimensions: 3 })
})
```

```sql
CREATE TABLE IF NOT EXISTS "table" (
	"embedding" vector(3)
);
```
</Section>

#### Indexes

You can now specify indexes for `pg_vector` and utilize `pg_vector` functions for querying, ordering, etc.

Let's take a few examples of `pg_vector` indexes from the `pg_vector` docs and translate them to Drizzle

#### L2 distance, Inner product and Cosine distance

```ts
// CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
// CREATE INDEX ON items USING hnsw (embedding vector_ip_ops);
// CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);

const table = pgTable('items', {
    embedding: vector({ dimensions: 3 })
}, (table) => [
  index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops'))
  index('ip_index').using('hnsw', table.embedding.op('vector_ip_ops'))
  index('cosine_index').using('hnsw', table.embedding.op('vector_cosine_ops'))
])
```

#### L1 distance, Hamming distance and Jaccard distance - added in pg_vector 0.7.0 version

```ts
// CREATE INDEX ON items USING hnsw (embedding vector_l1_ops);
// CREATE INDEX ON items USING hnsw (embedding bit_hamming_ops);
// CREATE INDEX ON items USING hnsw (embedding bit_jaccard_ops);

const table = pgTable('table', {
    embedding: vector({ dimensions: 3 })
}, (table) => [
  index('l1_index').using('hnsw', table.embedding.op('vector_l1_ops'))
  index('hamming_index').using('hnsw', table.embedding.op('bit_hamming_ops'))
  index('bit_jaccard_index').using('hnsw', table.embedding.op('bit_jaccard_ops'))
])
```

#### Helper Functions

For queries, you can use predefined functions for vectors or create custom ones using the SQL template operator.

You can also use the following helpers:

```ts
import { l2Distance, l1Distance, innerProduct, 
          cosineDistance, hammingDistance, jaccardDistance } from 'drizzle-orm'

l2Distance(table.column, [3, 1, 2]) // table.column <-> '[3, 1, 2]'
l1Distance(table.column, [3, 1, 2]) // table.column <+> '[3, 1, 2]'

innerProduct(table.column, [3, 1, 2]) // table.column <#> '[3, 1, 2]'
cosineDistance(table.column, [3, 1, 2]) // table.column <=> '[3, 1, 2]'

hammingDistance(table.column, '101') // table.column <~> '101'
jaccardDistance(table.column, '101') // table.column <%> '101'
```

If `pg_vector` has some other functions to use, you can replicate implementation from existing one we have. Here is how it can be done

```ts
export function l2Distance(
  column: SQLWrapper | AnyColumn,
  value: number[] | string[] | TypedQueryBuilder<any> | string,
): SQL {
  if (is(value, TypedQueryBuilder<any>) || typeof value === 'string') {
    return sql`${column} <-> ${value}`;
  }
  return sql`${column} <-> ${JSON.stringify(value)}`;
}
```

Name it as you wish and change the operator. This example allows for a numbers array, strings array, string, or even a select query. Feel free to create any other type you want or even contribute and submit a PR

#### Examples

Let's take a few examples of `pg_vector` queries from the `pg_vector` docs and translate them to Drizzle

```ts
import { l2Distance } from 'drizzle-orm';

// SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2]))

// SELECT embedding <-> '[3,1,2]' AS distance FROM items;
db.select({ distance: l2Distance(items.embedding, [3,1,2]) })

// SELECT * FROM items ORDER BY embedding <-> (SELECT embedding FROM items WHERE id = 1) LIMIT 5;
const subquery = db.select({ embedding: items.embedding }).from(items).where(eq(items.id, 1));
db.select().from(items).orderBy(l2Distance(items.embedding, subquery)).limit(5)

// SELECT (embedding <#> '[3,1,2]') * -1 AS inner_product FROM items;
db.select({ innerProduct: sql`(${maxInnerProduct(items.embedding, [3,1,2])}) * -1` }).from(items)

// and more!
```

### `postgis`

<Callout>
There is no specific code to create an extension inside the Drizzle schema. We assume that if you are using postgis types, indexes, and queries, you have a PostgreSQL database with the `postgis` extension installed.
</Callout>

As [PostGIS](https://postgis.net/) website mentions:

> PostGIS extends the capabilities of the PostgreSQL relational database by adding support for storing, indexing, and querying geospatial data.

<Callout type="info">
If you are using the `introspect` or `push` commands with the PostGIS extension and don't want PostGIS tables to be included, you can use [`extensionsFilters`](/docs/drizzle-config-file#extensionsfilters) to ignore all the PostGIS tables
</Callout>

#### Column Types

**`geometry`**

Store your geometry data with the rest of your data

For more info please refer to the official PostGIS docs **[docs.](https://postgis.net/workshops/postgis-intro/geometries.html)**

```ts
const items = pgTable('items', {
  geo: geometry('geo', { type: 'point' }),
  geoObj: geometry('geo_obj', { type: 'point', mode: 'xy' }),
  geoSrid: geometry('geo_options', { type: 'point', mode: 'xy', srid: 4000 }),
});
```

**mode**

Type `geometry` has 2 modes for mappings from the database: `tuple` and `xy`.

- `tuple` will be accepted for insert and mapped on select to a tuple. So, the database geometry will be typed as [1,2] with drizzle.
- `xy` will be accepted for insert and mapped on select to an object with x, y coordinates. So, the database geometry will be typed as `{ x: 1, y: 2 }` with drizzle

**type**

The current release has a predefined type: `point`, which is the `geometry(Point)` type in the PostgreSQL PostGIS extension. You can specify any string there if you want to use some other type

#### Indexes

With the available Drizzle indexes API, you should be able to write any indexes for PostGIS

**Examples**

```ts
// CREATE INDEX custom_idx ON table USING GIST (geom);

const table = pgTable('table', {
  	geo: geometry({ type: 'point' }),
}, (table) => [
  index('custom_idx').using('gist', table.geo)
])
```

Source: https://orm.drizzle.team/docs/extensions/singlestore


import Callout from '@mdx/Callout.astro';

<Callout>
Currently, there are no SingleStore extensions natively supported by Drizzle. Once those are added, we will have them here!
</Callout>

Source: https://orm.drizzle.team/docs/extensions/sqlite


import Callout from '@mdx/Callout.astro';

<Callout>
Currently, there are no SQLite extensions natively supported by Drizzle. Once those are added, we will have them here!
</Callout>

Source: https://orm.drizzle.team/docs/faq

import Callout from '@mdx/Callout.astro';

# FAQ & Troubleshooting

## **Should I use `generate` or `push`?**

Those are logically 2 different commands. `generate` is used to create an sql file together with additional
information needed for `drizzle-kit` (or any other migration tool).

After generating those migrations, they won't be applied to a database. 
You need to do it in the next step. You can read more about it **[here](/docs/migrations)**

On the other hand, `push` doesn't need any migrations to be generated. It will
simply sync your schema with the database schema. Please be careful when using it;
we recommend it only for local development and local databases. To read more about it, check out **[`drizzle-kit push`](/docs/drizzle-kit-push)**

## How `push` and `generate` works for PostgreSQL indexes

### Limitations

1. **You should specify a name for your index manually if you have an index on at least one expression**

Example

```ts
index().on(table.id, table.email) // will work well and name will be autogeneretaed
index('my_name').on(table.id, table.email) // will work well

// but

index().on(sql`lower(${table.email})`) // error
index('my_name').on(sql`lower(${table.email})`) // will work well
```

2. **Push won't generate statements if these fields(list below) were changed in an existing index:**

- expressions inside `.on()` and `.using()`
- `.where()` statements
- operator classes `.op()` on columns

If you are using `push` workflows and want to change these fields in the index, you would need to:

1. Comment out the index
2. Push
3. Uncomment the index and change those fields
4. Push again

For the `generate` command, `drizzle-kit` will be triggered by any changes in the index for any property in the new drizzle indexes API, so there are no limitations here.

Source: https://orm.drizzle.team/docs/generated-columns

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';
import Callout from '@mdx/Callout.astro';

# Generated Columns

<Callout type="info">
To use this feature you would need to have `drizzle-orm@0.32.0` or higher and `drizzle-kit@0.23.0` or higher
</Callout>

1. Virtual (or non-persistent) Generated Columns: These columns are computed dynamically whenever they are queried. They do not occupy storage space in the database.

2. Stored (or persistent) Generated Columns: These columns are computed when a row is inserted or updated and their values are stored in the database. This allows them to be indexed and can improve query performance since the values do not need to be recomputed for each query.

<Callout type="info">
    The implementation and usage of generated columns can vary significantly across different SQL databases. PostgreSQL, MySQL, and SQLite each have unique features, capabilities, and limitations when it comes to generated columns. In this section, we will explore these differences in detail to help you understand how to best utilize generated columns in each database system.
</Callout>

<Tabs items={["PostgreSQL", "MySQL", "SQLite", "SingleStore(WIP)", "MSSQL", "CockroachDB"]}>
  <Tab>
    #### Database side
    **Types**: `STORED` only

    **How It Works**
    - Automatically computes values based on other columns during insert or update.

    **Capabilities**
    - Simplifies data access by precomputing complex expressions.
    - Enhances query performance with index support on generated columns.

    **Limitations**
    - Cannot specify default values.
    - Expressions cannot reference other generated columns or include subqueries.
    - Schema changes required to modify generated column expressions.
    - Cannot directly use in primary keys, foreign keys, or unique constraints   

    For more info, please check [PostgreSQL](https://www.postgresql.org/docs/current/ddl-generated-columns.html) docs 

    #### Drizzle side
    In Drizzle you can specify `.generatedAlwaysAs()` function on any column type and add a supported sql query, 
    that will generate this column data for you.

    #### Features 
    This function can accept generated expression in 3 ways:

    **`string`**
    <CodeTab>
    ```ts
    export const test = pgTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(`hello world!`),
    });
    ```
    ```sql
    CREATE TABLE IF NOT EXISTS "test" (
	    "gen_name" text GENERATED ALWAYS AS (hello world!) STORED
    );
    ```
    </CodeTab>

    **`sql`** tag - if you want drizzle to escape some values for you

    <CodeTab>
    ```ts
    export const test = pgTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(sql`hello "world"!`),
    });
    ```
    ```sql
    CREATE TABLE IF NOT EXISTS "test" (
	    "gen_name" text GENERATED ALWAYS AS (hello "world"!) STORED
    );
    ```
    </CodeTab>

    **`callback`** - if you need to reference columns from a table
    <CodeTab>
    ```ts
    export const test = pgTable("test", {
        name: text("first_name"),
        generatedName: text("gen_name").generatedAlwaysAs(
          (): SQL => sql`hi, ${test.name}!`
        ),
    });
    ```
    ```sql
    CREATE TABLE IF NOT EXISTS "test" (
	    "first_name" text,
	    "gen_name" text GENERATED ALWAYS AS (hi, "test"."first_name"!) STORED
    );
    ```
    </CodeTab>

    **Example** generated columns with full-text search
   <CodeTabs items={["schema.ts"]}>
	<CodeTab>
	```typescript copy {17-19}
    import { SQL, sql } from "drizzle-orm";
    import { customType, index, integer, pgTable, text } from "drizzle-orm/pg-core";

    const tsVector = customType<{ data: string }>({
      dataType() {
        return "tsvector";
      },
    });

    export const test = pgTable(
      "test",
      {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        content: text("content"),
        contentSearch: tsVector("content_search", {
          dimensions: 3,
        }).generatedAlwaysAs(
          (): SQL => sql`to_tsvector('english', ${test.content})`
        ),
      },
      (t) => [
        index("idx_content_search").using("gin", t.contentSearch)
      ]
    );
    ```
    ```sql {4}
    CREATE TABLE IF NOT EXISTS "test" (
    	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "test_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    	"content" text,
    	"content_search" "tsvector" GENERATED ALWAYS AS (to_tsvector('english', "test"."content")) STORED
    );
    --> statement-breakpoint
    CREATE INDEX IF NOT EXISTS "idx_content_search" ON "test" USING gin ("content_search");
    ```
    </CodeTab>
   </CodeTabs>
  </Tab> 
  <Tab>
    #### Database side
    **Types**: `STORED`, `VIRTUAL`

    **How It Works**
    - Defined with an expression in the table schema.
    - Virtual columns are computed during read operations.
    - Stored columns are computed during write operations and stored.

    **Capabilities**
    - Used in SELECT, INSERT, UPDATE, and DELETE statements.
    - Can be indexed, both virtual and stored.
    - Can specify NOT NULL and other constraints.
    
    **Limitations**
    - Cannot directly insert or update values in a generated column 

    For more info, please check [MySQL Alter Generated](https://dev.mysql.com/doc/refman/8.4/en/alter-table-generated-columns.html) docs and [MySQL create generated](https://dev.mysql.com/doc/refman/8.4/en/create-table-generated-columns.html) docs

    #### Drizzle side

    #### Features 

    **`string`**
    <CodeTab>
    ```ts
    export const test = mysqlTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(`hello world!`),
    });
    ```
    ```sql
    CREATE TABLE `test` (
	    `gen_name` text GENERATED ALWAYS AS (hello world!) VIRTUAL
    );
    ```
    </CodeTab>

    **`sql`** tag - if you want drizzle to escape some values for you

    <CodeTab>
    ```ts
    export const test = mysqlTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(sql`hello "world"!`),
    });
    ```
    ```sql
    CREATE TABLE `test` (
	    `gen_name` text GENERATED ALWAYS AS (hello "world"!) VIRTUAL
    );
    ```
    </CodeTab>

    **`callback`** - if you need to reference columns from a table

    <CodeTab>
    ```ts
    export const test = mysqlTable("test", {
        name: text("first_name"),
        generatedName: text("gen_name").generatedAlwaysAs(
          (): SQL => sql`hi, ${test.name}!`
        ),
    });
    ```
    ```sql
    CREATE TABLE `test` (
    	`first_name` text,
    	`gen_name` text GENERATED ALWAYS AS (hi, `test`.`first_name`!) VIRTUAL
    );
    ```
    </CodeTab>
    #### Limitations
    Drizzle Kit will also have limitations for `push` command:
    1. You can't change the generated constraint expression and type using `push`. Drizzle-kit will ignore this change. To make it work, you would need to `drop the column`, `push`, and then `add a column with a new expression`. This was done due to the complex mapping from the database side, where the schema expression will be modified on the database side and, on introspection, we will get a different string. We can't be sure if you changed this expression or if it was changed and formatted by the database. As long as these are generated columns and `push` is mostly used for prototyping on a local database, it should be fast to `drop` and `create` generated columns. Since these columns are `generated`, all the data will be restored
    2. `generate` should have no limitations

  <CodeTabs items={["schema.ts"]}>
	<CodeTab>
	```typescript copy
    export const users = mysqlTable("users", {
        id: int("id"),
        id2: int("id2"),
        name: text("name"),
        storedGenerated: text("stored_gen").generatedAlwaysAs(
          (): SQL => sql`${users.name} || 'hello'`,
          { mode: "stored" }
        ),
        virtualGenerated: text("virtual_gen").generatedAlwaysAs(
          (): SQL => sql`${users.name} || 'hello'`,
          { mode: "virtual" }
        ),
    })
    ```
    ```sql
    CREATE TABLE `users` (
	    `id` int,
	    `id2` int,
	    `name` text,
	    `stored_gen` text GENERATED ALWAYS AS (`users`.`name` || 'hello') STORED,
	    `virtual_gen` text GENERATED ALWAYS AS (`users`.`name` || 'hello') VIRTUAL
    );
    ```
    </CodeTab>
  </CodeTabs>
  </Tab> 
  <Tab>
    #### Database side
    **Types**: `STORED`, `VIRTUAL`

    **How It Works**
    - Defined with an expression in the table schema.
    - Virtual columns are computed during read operations.
    - Stored columns are computed during write operations and stored.

    **Capabilities**
    - Used in SELECT, INSERT, UPDATE, and DELETE statements.
    - Can be indexed, both virtual and stored.
    - Can specify NOT NULL and other constraints.
    
    **Limitations**
    - Cannot directly insert or update values in a generated column 

    For more info, please check [SQLite](https://www.sqlite.org/gencol.html) docs 

    #### Drizzle side

    #### Features
    **`string`**
    ```ts
    export const test = sqliteTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(`hello world!`),
    });
    ```
    ```sql
    CREATE TABLE `test` (
	    `gen_name` text GENERATED ALWAYS AS (hello world!) VIRTUAL
    );
    ```

    **`sql`** tag - if you want drizzle to escape some values for you

    ```ts
    export const test = sqliteTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(sql`hello "world"!`),
    });
    ```
    ```sql
    CREATE TABLE `test` (
	    `gen_name` text GENERATED ALWAYS AS (hello "world"!) VIRTUAL
    );
    ```

    **`callback`** - if you need to reference columns from a table

    ```ts
    export const test = sqliteTable("test", {
        name: text("first_name"),
        generatedName: text("gen_name").generatedAlwaysAs(
          (): SQL => sql`hi, ${test.name}!`
        ),
    });
    ```
    ```sql
    CREATE TABLE `test` (
	    `first_name` text,
	    `gen_name` text GENERATED ALWAYS AS (hi, "first_name"!) VIRTUAL
    );
    ```

    #### Limitations
    Drizzle Kit will also have limitations for `push` and `generate` command:
    1. You can't change the generated constraint expression with the stored type in an existing table. You would need to delete this table and create it again. This is due to SQLite limitations for such actions. We will handle this case in future releases (it will involve the creation of a new table with data migration).
    2. You can't add a `stored` generated expression to an existing column for the same reason as above. However, you can add a `virtual` expression to an existing column.
    3. You can't change a `stored` generated expression in an existing column for the same reason as above. However, you can change a `virtual` expression.
    4. You can't change the generated constraint type from `virtual` to `stored` for the same reason as above. However, you can change from `stored` to `virtual`.

   <CodeTabs items={["index.ts", "schema.ts"]}>
	<CodeTab>
	```typescript copy
    export const users = sqliteTable("users", {
      id: int("id"),
      name: text("name"),
      storedGenerated: text("stored_gen").generatedAlwaysAs(
        (): SQL => sql`${users.name} || 'hello'`,
        { mode: "stored" }
      ),
      virtualGenerated: text("virtual_gen").generatedAlwaysAs(
        (): SQL => sql`${users.name} || 'hello'`,
        { mode: "virtual" }
      ),
    });
    ```
    ```sql
    CREATE TABLE `users` (
	    `id` integer,
	    `name` text,
	    `stored_gen` text GENERATED ALWAYS AS ("name" || 'hello') STORED,
	    `virtual_gen` text GENERATED ALWAYS AS ("name" || 'hello') VIRTUAL
    );
    ```
    </CodeTab>
  </CodeTabs>
  </Tab> 
  <Tab>
  Work in Progress
  </Tab>
<Tab>
    #### Database side
    **Types**: `PERSISTED`, `VIRTUAL`

    **How It Works**
    - Defined with an expression in the table schema.
    - Virtual columns are computed during read operations.
    - Persisted columns are computed during write operations and stored.

    For more info, please check [MSSQL](https://learn.microsoft.com/en-us/sql/relational-databases/tables/specify-computed-columns-in-a-table?view=sql-server-ver17) docs

    #### Drizzle side

    #### Features 

    **`string`**
    <CodeTab>
    ```ts
    export const test = mssqlTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(`hello world!`),
    });
    ```
    ```sql
    CREATE TABLE [test] (
	    [gen_name] AS ('hello world!') VIRTUAL
    );
    ```
    </CodeTab>

    **`sql`** tag - if you want drizzle to escape some values for you

    <CodeTab>
    ```ts
    export const test = mssqlTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(sql`hello "world"!`),
    });
    ```
    ```sql
    CREATE TABLE [test] (
	    [gen_name] AS ('hello "world"!') VIRTUAL
    );
    ```
    </CodeTab>

    **`callback`** - if you need to reference columns from a table

    <CodeTab>
    ```ts
    export const test = mssqlTable("test", {
        name: text("first_name"),
        generatedName: text("gen_name").generatedAlwaysAs(
          (): SQL => sql`hi, ${test.name}!`
        ),
    });
    ```
    ```sql
    CREATE TABLE [test] (
    	[first_name] text,
    	[gen_name] AS ('hi, [test].[first_name]!') VIRTUAL
    );
    ```
    </CodeTab>
  </Tab>
  <Tab>
    In Drizzle you can specify `.generatedAlwaysAs()` function on any column type and add a supported sql query, 
    that will generate this column data for you.

    #### Features 
    This function can accept generated expression in 3 ways:

    **`string`**
    <CodeTab>
    ```ts
    export const test = cockroachTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(`hello world!`),
    });
    ```
    ```sql
    CREATE TABLE "test" (
	    "gen_name" text GENERATED ALWAYS AS (hello world!) STORED
    );
    ```
    </CodeTab>

    **`sql`** tag - if you want drizzle to escape some values for you

    <CodeTab>
    ```ts
    export const test = cockroachTable("test", {
        generatedName: text("gen_name").generatedAlwaysAs(sql`hello "world"!`),
    });
    ```
    ```sql
    CREATE TABLE "test" (
	    "gen_name" text GENERATED ALWAYS AS (hello "world"!) STORED
    );
    ```
    </CodeTab>

    **`callback`** - if you need to reference columns from a table
    <CodeTab>
    ```ts
    export const test = cockroachTable("test", {
        name: text("first_name"),
        generatedName: text("gen_name").generatedAlwaysAs(
          (): SQL => sql`hi, ${test.name}!`
        ),
    });
    ```
    ```sql
    CREATE TABLE "test" (
	    "first_name" text,
	    "gen_name" text GENERATED ALWAYS AS (hi, "test"."first_name"!) STORED
    );
    ```
    </CodeTab>

    **Example** generated columns with full-text search
   <CodeTabs items={["schema.ts"]}>
	<CodeTab>
	```typescript copy {17-19}
    import { SQL, sql } from "drizzle-orm";
    import { customType, index, int4, cockroachTable, text } from "drizzle-orm/cockroach-core";

    const tsVector = customType<{ data: string }>({
      dataType() {
        return "tsvector";
      },
    });

    export const test = cockroachTable(
      "test",
      {
        id: int4().primaryKey().generatedAlwaysAsIdentity(),
        content: text("content"),
        contentSearch: tsVector("content_search", {
          dimensions: 3,
        }).generatedAlwaysAs(
          (): SQL => sql`to_tsvector('english', ${test.content})`
        ),
      },
      (t) => [
        index("idx_content_search").using("gin", t.contentSearch)
      ]
    );
    ```
    ```sql {4}
    CREATE TABLE "test" (
    	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "test_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    	"content" text,
    	"content_search" "tsvector" GENERATED ALWAYS AS (to_tsvector('english', "test"."content")) STORED
    );
    --> statement-breakpoint
    CREATE INDEX "idx_content_search" ON "test" USING gin ("content_search");
    ```
    </CodeTab>
   </CodeTabs>
  </Tab> 
</Tabs>


Source: https://orm.drizzle.team/docs/get-started-cockroach

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import Steps from '@mdx/Steps.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";

# Drizzle \<\> PostgreSQL

<Callout type='error'>
This page explains concepts available on drizzle versions `1.0.0-beta.2` and higher.
</Callout>

<br/>

<Prerequisites>
- Database [connection basics](/docs/connect-overview) with Drizzle
- node-postgres [basics](https://node-postgres.com/)
</Prerequisites>

Drizzle has native support for PostgreSQL connections with the `node-postgres` driver.

#### Step 1 - Install packages
<Npm>
drizzle-orm@beta pg
-D drizzle-kit@beta @types/pg
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={["node-postgres", "node-postgres with config"]}>
```typescript copy
// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/cockroach';

const db = drizzle(process.env.DATABASE_URL);
 
const result = await db.execute('select 1');
```
```typescript copy
// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/cockroach';

// You can specify any property from the node-postgres connection options
const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
 
const result = await db.execute('select 1');
```
</CodeTabs>

If you need to provide your existing driver:

```typescript copy
// Make sure to install the 'pg' package 
import { drizzle } from "drizzle-orm/cockroach";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: pool });
 
const result = await db.execute('select 1');
```

#### What's next?

<WhatsNextPostgres/>

Source: https://orm.drizzle.team/docs/get-started-gel

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import Steps from '@mdx/Steps.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";

# Drizzle \<\> Gel
<Prerequisites>
- Database [connection basics](/docs/connect-overview) with Drizzle
- gel-js [basics](https://github.com/geldata/gel-js)
</Prerequisites>

Drizzle has native support for Gel connections with the `gel-js` client.

#### Step 1 - Install packages
<Npm>
drizzle-orm gel
-D drizzle-kit
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={["gel", "gel with config"]}>
```typescript copy
// Make sure to install the 'gel' package 
import { drizzle } from 'drizzle-orm/gel';

const db = drizzle(process.env.DATABASE_URL);
 
const result = await db.execute('select 1');
```
```typescript copy
// Make sure to install the 'gel' package
import { drizzle } from "drizzle-orm/gel";

// You can specify any property from the gel connection options
const db = drizzle({
  connection: {
    dsn: process.env.DATABASE_URL,
    tlsSecurity: "default",
  },
});

const result = await db.execute("select 1");
```
</CodeTabs>

If you need to provide your existing driver:

```typescript copy
// Make sure to install the 'gel' package 
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";

const gelClient = createClient();
const db = drizzle({ client: gelClient });

const result = await db.execute('select 1');
```

#### What's next?

<WhatsNextPostgres/>


Source: https://orm.drizzle.team/docs/get-started-mssql

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import Steps from '@mdx/Steps.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextMSSQL from "@mdx/WhatsNextMSSQL.astro";

# Drizzle \<\> MSSQL

<Callout type='error'>
This page explains concepts available on drizzle versions `1.0.0-beta.2` and higher.
</Callout>

<br/>

<Prerequisites>
- Database [connection basics](/docs/connect-overview) with Drizzle
- node-mssql [basics](https://github.com/tediousjs/node-mssql)
</Prerequisites>

Drizzle has native support for MSSQL connections with the `mssql` driver.

#### Step 1 - Install packages
<Npm>
drizzle-orm@beta mssql
-D drizzle-kit@beta
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={["mssql", "mssql with config"]}>
```typescript copy
// Make sure to install the 'mssql' package 
import { drizzle } from 'drizzle-orm/node-mssql';

const db = drizzle(process.env.DATABASE_URL);
 
const result = await db.execute('select 1');
```
```typescript copy
// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/node-mssql';

// You can specify any property from the mssql connection options
const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
 
const result = await db.execute('select 1');
```
</CodeTabs>

<Callout type='warning'>
As long as the `node-mssql` driver requires `await` on `Pool` initialization, we need to `await` it before each request - unless you are providing your own Pool instance to Drizzle. In that case, when you want to access `db.$client`, you first need to `await` it, and then use it

```ts
const awaitedClient = await db.$client;
const response = awaitedClient.query...
```
</Callout>

If you need to provide your existing driver:

```typescript copy
// Make sure to install the 'mssql' package 
import { drizzle } from "drizzle-orm/node-mssql";
import type { ConnectionPool } from 'mssql';

const pool = await mssql.connect(connectionString);
const db = drizzle({ client: pool });
 
const result = await db.execute('select 1');
```

#### What's next?

<WhatsNextMSSQL/>

Source: https://orm.drizzle.team/docs/get-started-mysql

import Npm from '@mdx/Npm.astro';
import Callout from '@mdx/Callout.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";

# Drizzle \<\> MySQL

To use Drizzle with a MySQL database, you should use the `mysql2` driver

According to the **[official website](https://github.com/sidorares/node-mysql2)**, 
`mysql2` is a MySQL client for Node.js with focus on performance.  

Drizzle ORM natively supports `mysql2` with `drizzle-orm/mysql2` package.

#### Step 1 - Install packages
<Npm>
drizzle-orm mysql2
-D drizzle-kit
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={['mysql2', 'mysql with config']}>
```typescript copy
import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(process.env.DATABASE_URL);

const response = await db.select().from(...)
```
```typescript copy
import { drizzle } from "drizzle-orm/mysql2";

// You can specify any property from the mysql2 connection options
const db = drizzle({ connection:{ uri: process.env.DATABASE_URL }});

const response = await db.select().from(...)
```
</CodeTabs>

If you need to provide your existing driver:

<CodeTabs items={['Client connection', 'Pool connection']}>
  ```typescript copy
  import { drizzle } from "drizzle-orm/mysql2";
  import mysql from "mysql2/promise";

  const connection = await mysql.createConnection({
    host: "host",
    user: "user",
    database: "database",
    ...
  });

  const db = drizzle({ client: connection });
  ```
  ```typescript copy
  import { drizzle } from "drizzle-orm/mysql2";
  import mysql from "mysql2/promise";

  const poolConnection = mysql.createPool({
    host: "host",
    user: "user",
    database: "database",
    ...
  });

  const db = drizzle({ client: poolConnection });
  ```
</CodeTabs>

<Callout type="warning" emoji="⚙️">
  For the built in `migrate` function with DDL migrations we and drivers strongly encourage you to use single `client` connection.  

  For querying purposes feel free to use either `client` or `pool` based on your business demands.
</Callout>

#### What's next?

<WhatsNextPostgres/>

Source: https://orm.drizzle.team/docs/get-started-postgresql

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import Steps from '@mdx/Steps.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";

# Drizzle \<\> PostgreSQL
<Prerequisites>
- Database [connection basics](/docs/connect-overview) with Drizzle
- node-postgres [basics](https://node-postgres.com/)
- postgres.js [basics](https://github.com/porsager/postgres?tab=readme-ov-file#usage)
</Prerequisites>

Drizzle has native support for PostgreSQL connections with the `node-postgres` and `postgres.js` drivers.

There are a few differences between the `node-postgres` and `postgres.js` drivers that we discovered while using both and integrating them with the Drizzle ORM. For example:

- With `node-postgres`, you can install `pg-native` to boost the speed of both `node-postgres` and Drizzle by approximately 10%.
- `node-postgres` supports providing type parsers on a per-query basis without globally patching things. For more details, see [Types Docs](https://node-postgres.com/features/queries#types).
- `postgres.js` uses prepared statements by default, which you may need to opt out of. This could be a potential issue in AWS environments, among others, so please keep that in mind.
- If there's anything else you'd like to contribute, we'd be happy to receive your PRs [here](https://github.com/drizzle-team/drizzle-orm-docs/pulls)

## node-postgres
#### Step 1 - Install packages
<Npm>
drizzle-orm pg
-D drizzle-kit @types/pg
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={["node-postgres", "node-postgres with config"]}>
```typescript copy
// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle(process.env.DATABASE_URL);
 
const result = await db.execute('select 1');
```
```typescript copy
// Make sure to install the 'pg' package 
import { drizzle } from 'drizzle-orm/node-postgres';

// You can specify any property from the node-postgres connection options
const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
 
const result = await db.execute('select 1');
```
</CodeTabs>

If you need to provide your existing driver:

```typescript copy
// Make sure to install the 'pg' package 
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: pool });
 
const result = await db.execute('select 1');
```

## postgres.js
#### Step 1 - Install packages
<Npm>
drizzle-orm postgres
-D drizzle-kit
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={["postgres.js", "postgres.js with config"]}>
```typescript copy
import { drizzle } from 'drizzle-orm/postgres-js';

const db = drizzle(process.env.DATABASE_URL);

const result = await db.execute('select 1');
```
```typescript copy
import { drizzle } from 'drizzle-orm/postgres-js';

// You can specify any property from the postgres-js connection options
const db = drizzle({ 
  connection: { 
    url: process.env.DATABASE_URL, 
    ssl: true 
  }
});

const result = await db.execute('select 1');
```
</CodeTabs>

If you need to provide your existing driver:

```typescript copy
// Make sure to install the 'postgres' package
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });

const result = await db.execute('select 1');
```

#### What's next?

<WhatsNextPostgres/>

Source: https://orm.drizzle.team/docs/get-started-singlestore

import Npm from '@mdx/Npm.astro';
import Callout from '@mdx/Callout.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";

# Drizzle \<\> SingleStore

To use Drizzle with a SingleStore database, you should use the `mysql2` driver

Drizzle ORM natively supports `mysql2` with `drizzle-orm/singlestore` package.

#### Step 1 - Install packages
<Npm>
drizzle-orm mysql2
-D drizzle-kit
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={['mysql2', 'mysql with config']}>
```typescript copy
import { drizzle } from "drizzle-orm/singlestore";

const db = drizzle(process.env.DATABASE_URL);

const response = await db.select().from(...)
```
```typescript copy
import { drizzle } from "drizzle-orm/singlestore";

// You can specify any property from the mysql2 connection options
const db = drizzle({ connection:{ uri: process.env.DATABASE_URL }});

const response = await db.select().from(...)
```
</CodeTabs>

If you need to provide your existing driver:

<CodeTabs items={['Client connection', 'Pool connection']}>
  ```typescript copy
  import { drizzle } from "drizzle-orm/singlestore";
  import mysql from "mysql2/promise";

  const connection = await mysql.createConnection({
    host: "host",
    user: "user",
    database: "database",
    ...
  });

  const db = drizzle({ client: connection });
  ```
  ```typescript copy
  import { drizzle } from "drizzle-orm/singlestore";
  import mysql from "mysql2/promise";

  const poolConnection = mysql.createPool({
    host: "host",
    user: "user",
    database: "database",
    ...
  });

  const db = drizzle({ client: poolConnection });
  ```
</CodeTabs>

<Callout type="warning" emoji="⚙️">
  For the built in `migrate` function with DDL migrations we and drivers strongly encourage you to use single `client` connection.  

  For querying purposes feel free to use either `client` or `pool` based on your business demands.
</Callout>

#### Limitations

Currently, the SingleStore dialect has a set of limitations and features that do not work on the SingleStore database side:

- SingleStore's serial column type only ensures the uniqueness of column values.
- `ORDER BY` and `LIMIT` cannot be chained together.
- Foreign keys are not supported (check).
- `INTERSECT ALL` and `EXCEPT ALL` operations are not supported by SingleStore.
- Nested transactions are not supported by [SingleStore](https://docs.singlestore.com/cloud/reference/sql-reference/procedural-sql-reference/transactions-in-stored-procedures/).
- SingleStore [only supports](https://docs.singlestore.com/cloud/getting-started-with-singlestore-helios/about-singlestore-helios/singlestore-helios-faqs/durability/) one `isolationLevel`.
- The FSP option in `DATE`, `TIMESTAMP`, and `DATETIME` is not supported.
- The relational API is not supported and will be implemented once the SingleStore team develops all the necessary APIs for it.
- There may be more limitations because SingleStore is not 100% compatible with MySQL.

#### What's next?

<WhatsNextPostgres/>

Source: https://orm.drizzle.team/docs/get-started-sqlite

import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Steps from '@mdx/Steps.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";
import LibsqlTable from '@mdx/LibsqlTable.mdx';
import LibsqlTabs from '@mdx/LibsqlTabs.mdx';

# Drizzle \<\> SQLite

Drizzle has native support for SQLite connections with the `libsql` and `better-sqlite3` drivers.
  
There are a few differences between the `libsql` and `better-sqlite3` drivers that we discovered while using both and integrating them with the Drizzle ORM. For example:

At the driver level, there may not be many differences between the two, but the main one is that `libSQL` can connect to both SQLite files and `Turso` remote databases. LibSQL is a fork of SQLite that offers a bit more functionality compared to standard SQLite, such as:

- More ALTER statements are available with the `libSQL` driver, allowing you to manage your schema more easily than with just `better-sqlite3`.
- You can configure the encryption at rest feature natively.
- A large set of extensions supported by the SQLite database is also supported by `libSQL`.

## libsql
#### Step 1 - Install packages
<Npm>
drizzle-orm @libsql/client
-D drizzle-kit
</Npm>

#### Step 2 - Initialize the driver
Drizzle has native support for all @libsql/client driver variations:

<LibsqlTable />
<br/>
<LibsqlTabs />

#### Step 3 - make a query
<CodeTabs items={["libsql", "libsql with config"]}>
```typescript copy
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle(process.env.DATABASE_URL);
 
const result = await db.execute('select 1');
```
```typescript copy
import { drizzle } from 'drizzle-orm/libsql';

// You can specify any property from the libsql connection options
const db = drizzle({ connection: { url:'', authToken: '' }});
 
const result = await db.execute('select 1');
```
</CodeTabs>

If you need a synchronous connection, you can use our additional connection API, 
where you specify a driver connection and pass it to the Drizzle instance.

```typescript copy
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client);

const result = await db.execute('select 1');
```

## better-sqlite3
#### Step 1 - Install packages
<Npm>
drizzle-orm better-sqlite3
-D drizzle-kit @types/better-sqlite3
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={["better-sqlite3", "better-sqlite3 with config"]}>
```typescript copy
import { drizzle } from 'drizzle-orm/better-sqlite3';

const db = drizzle(process.env.DATABASE_URL);

const result = await db.execute('select 1');
```
```typescript copy
import { drizzle } from 'drizzle-orm/better-sqlite3';

// You can specify any property from the better-sqlite3 connection options
const db =  drizzle({ connection: { source: process.env.DATABASE_URL }});

const result = await db.execute('select 1');
```
</CodeTabs>

If you need to provide your existing driver:
```typescript copy
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });

const result = await db.execute('select 1');
```

#### What's next?

<WhatsNextPostgres/>


Source: https://orm.drizzle.team/docs/get-started

import Callout from '@mdx/Callout.astro';
import CodeTabs from '@mdx/CodeTabs.astro';
import YoutubeCards from '@mdx/YoutubeCards.astro';
import GetStartedLinks from '@mdx/GetStartedLinks/index.astro';

# Get started with Drizzle
<GetStartedLinks />

Source: https://orm.drizzle.team/docs/get-started/bun-sql-existing

import Npm from '@mdx/Npm.astro';
import Npx from '@mdx/Npx.astro';
import Callout from '@mdx/Callout.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import TransferCode from '@mdx/get-started/TransferCode.mdx';
import QueryDatabase from '@mdx/get-started/QueryDatabase.mdx';
import QueryDatabaseUpdated from '@mdx/get-started/QueryDatabaseUpdated.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';
import IntrospectPostgreSQL from '@mdx/get-started/postgresql/IntrospectPostgreSQL.mdx';
import ConnectBun from '@mdx/get-started/postgresql/ConnectBun.mdx';
import UpdateSchema from '@mdx/get-started/postgresql/UpdateSchema.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and SQLite in existing project

<Prerequisites>  
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **bun** - javaScript all-in-one toolkit - [read here](https://bun.sh/)
  - **Bun SQL** - native bindings for working with PostgreSQL databases - [read here](https://bun.sh/docs/api/sql)
</Prerequisites>

<Callout type='error'>
In version `1.2.0`, Bun has issues with executing concurrent statements, which may lead to errors if you try to run several queries simultaneously.
We've created a [github issue](https://github.com/oven-sh/bun/issues/16774) that you can track. Once it's fixed, you should no longer encounter any such errors on Bun's SQL side
</Callout>

<FileStructure />

#### Step 1 - Install required packages

<Npm>
  drizzle-orm dotenv
  -D drizzle-kit @types/bun
</Npm>

#### Step 2 - Setup connection variables

<SetupEnv env_variable='DATABASE_URL' />

#### Step 3 - Setup Drizzle config file

<SetupConfig dialect='postgresql' env_variable='DATABASE_URL'/>

#### Step 4 - Introspect your database

<IntrospectPostgreSQL/>

#### Step 5 - Transfer code to your actual schema file

<TransferCode/>

#### Step 6 - Connect Drizzle ORM to the database

<ConnectBun/>

#### Step 7 - Query the database

<QueryDatabase dialect='bun-sql' env_variable='DATABASE_URL' />

#### Step 8 - Run index.ts file

To run a script with `bun`, use the following command:
```bash copy
bun src/index.ts
```

#### Step 9 - Update your table schema (optional)

<UpdateSchema/>

#### Step 9 - Applying changes to the database (optional)

<ApplyChanges/>

#### Step 10 - Query the database with a new field (optional)

<QueryDatabaseUpdated dialect='bun-sql' env_variable='DATABASE_URL' />

Source: https://orm.drizzle.team/docs/get-started/bun-sql-new

import Npm from '@mdx/Npm.astro';
import Npx from '@mdx/Npx.astro';
import Callout from '@mdx/Callout.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import TransferCode from '@mdx/get-started/TransferCode.mdx';
import QueryDatabase from '@mdx/get-started/QueryDatabase.mdx';
import QueryDatabaseUpdated from '@mdx/get-started/QueryDatabaseUpdated.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';
import CreateTable from '@mdx/get-started/postgresql/CreateTable.mdx';
import ConnectBun from '@mdx/get-started/postgresql/ConnectBun.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and Bun:SQLite

<Prerequisites>  
  - **bun** - javaScript all-in-one toolkit - [read here](https://bun.sh/)
  - **Bun SQL** - native bindings for working with PostgreSQL databases - [read here](https://bun.sh/docs/api/sql)
</Prerequisites>

<Callout type='error'>
In version `1.2.0`, Bun has issues with executing concurrent statements, which may lead to errors if you try to run several queries simultaneously.
We've created a [github issue](https://github.com/oven-sh/bun/issues/16774) that you can track. Once it's fixed, you should no longer encounter any such errors on Bun's SQL side
</Callout>

<FileStructure />

#### Step 1 - Install required packages
<Npm>
  drizzle-orm
  -D drizzle-kit @types/bun
</Npm>

#### Step 2 - Setup connection variables

<SetupEnv env_variable='DATABASE_URL' />

#### Step 3 - Connect Drizzle ORM to the database

<ConnectBun/>

#### Step 4 - Create a table

<CreateTable/>

#### Step 5 - Setup Drizzle config file

<SetupConfig dialect='postgresql' env_variable='DATABASE_URL'/>

#### Step 6 - Applying changes to the database

<ApplyChanges />

#### Step 7 - Seed and Query the database

<QueryDatabase dialect='bun-sql' env_variable='DATABASE_URL'/>

#### Step 8 - Run index.ts file

To run a script with `bun`, use the following command:
```bash copy
bun src/index.ts
```

Source: https://orm.drizzle.team/docs/get-started/bun-sqlite-existing

import Npm from '@mdx/Npm.astro';
import Npx from '@mdx/Npx.astro';
import Callout from '@mdx/Callout.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import TransferCode from '@mdx/get-started/TransferCode.mdx';
import QueryDatabase from '@mdx/get-started/QueryDatabase.mdx';
import QueryDatabaseUpdated from '@mdx/get-started/QueryDatabaseUpdated.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';
import IntrospectSqlite from '@mdx/get-started/sqlite/IntrospectSqlite.mdx';
import ConnectBun from '@mdx/get-started/sqlite/ConnectBun.mdx';
import UpdateSchema from '@mdx/get-started/sqlite/UpdateSchema.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and Bun:SQLite in existing project

<Prerequisites>  
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **bun** - javaScript all-in-one toolkit - [read here](https://bun.sh/)
  - **bun:sqlite** - native implementation of a high-performance SQLite3 driver - [read here](https://bun.sh/docs/api/sqlite)
</Prerequisites>

<FileStructure />

#### Step 1 - Install required packages

<Npm>
  drizzle-orm dotenv
  -D drizzle-kit tsx @types/bun
</Npm>

#### Step 2 - Setup connection variables

<SetupEnv env_variable='DB_FILE_NAME' />

<Callout type='info' title='important'>
For example, if you have an SQLite database file in the root of your project, you can use this example:
```plaintext copy
DB_FILE_NAME=mydb.sqlite
```
</Callout>


#### Step 3 - Setup Drizzle config file

<SetupConfig dialect='sqlite' env_variable='DB_FILE_NAME'/>

#### Step 4 - Introspect your database

<IntrospectSqlite/>

#### Step 5 - Transfer code to your actual schema file

<TransferCode/>

#### Step 6 - Connect Drizzle ORM to the database

<ConnectBun/>

#### Step 7 - Query the database

<QueryDatabase dialect='bun-sqlite' env_variable='DB_FILE_NAME' />

#### Step 8 - Run index.ts file

To run a script with `bun`, use the following command:
```bash copy
bun src/index.ts
```

#### Step 9 - Update your table schema (optional)

<UpdateSchema/>

#### Step 9 - Applying changes to the database (optional)

<ApplyChanges/>

#### Step 10 - Query the database with a new field (optional)

<QueryDatabaseUpdated dialect='bun-sqlite' env_variable='DB_FILE_NAME' />

Source: https://orm.drizzle.team/docs/get-started/bun-sqlite-new

import Npm from '@mdx/Npm.astro';
import Npx from '@mdx/Npx.astro';
import Callout from '@mdx/Callout.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import TransferCode from '@mdx/get-started/TransferCode.mdx';
import QueryDatabase from '@mdx/get-started/QueryDatabase.mdx';
import QueryDatabaseUpdated from '@mdx/get-started/QueryDatabaseUpdated.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';
import CreateTable from '@mdx/get-started/sqlite/CreateTable.mdx';
import ConnectBun from '@mdx/get-started/sqlite/ConnectBun.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and Bun:SQLite

<Prerequisites>  
  - **bun** - javaScript all-in-one toolkit - [read here](https://bun.sh/)
  - **bun:sqlite** - native implementation of a high-performance SQLite3 driver - [read here](https://bun.sh/docs/api/sqlite)
</Prerequisites>

<FileStructure />

#### Step 1 - Install required packages
<Npm>
  drizzle-orm
  -D drizzle-kit @types/bun
</Npm>

#### Step 2 - Setup connection variables

<SetupEnv env_variable='DB_FILE_NAME' />

<Callout type='info' title='important'>
For example, if you want to create an SQLite database file in the root of your project for testing purposes, you can use this example:
```plaintext copy
DB_FILE_NAME=mydb.sqlite
```
</Callout>

#### Step 3 - Connect Drizzle ORM to the database

<ConnectBun/>

#### Step 4 - Create a table

<CreateTable/>

#### Step 5 - Setup Drizzle config file

<SetupConfig dialect='sqlite' env_variable='DB_FILE_NAME'/>

#### Step 6 - Applying changes to the database

<ApplyChanges />

#### Step 7 - Seed and Query the database

<QueryDatabase dialect='bun-sqlite' env_variable='DB_FILE_NAME'/>

#### Step 8 - Run index.ts file

To run a script with `bun`, use the following command:
```bash copy
bun src/index.ts
```

Source: https://orm.drizzle.team/docs/get-started/cockroach-existing

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import Steps from '@mdx/Steps.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import CodeTabs from "@mdx/CodeTabs.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import IntrospectCockroach from '@mdx/get-started/cockroach/IntrospectCockroach.mdx';
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';
import TransferCode from '@mdx/get-started/TransferCode.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import ConnectCockroach from '@mdx/get-started/cockroach/ConnectCockroach.mdx'
import QueryDatabase from '@mdx/get-started/QueryDatabase.mdx';
import QueryDatabaseUpdated from '@mdx/get-started/QueryDatabaseUpdated.mdx';
import UpdateSchema from '@mdx/get-started/cockroach/UpdateSchema.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and CockroachDB in existing project

<Callout type='error'>
This page explains concepts available on drizzle versions `1.0.0-beta.2` and higher.
</Callout>

<br/>

<Prerequisites>
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **node-postgres** - package for querying your PostgreSQL database - [read here](https://node-postgres.com/)
</Prerequisites>

<FileStructure/>

#### Step 1 - Install **node-postgres** package
<Npm>
  drizzle-orm@beta pg dotenv
  -D drizzle-kit@beta tsx @types/pg
</Npm>


#### Step 2 - Setup connection variables

<SetupEnv env_variable='DATABASE_URL' />

<Callout title='tips'>
If you don't have a PostgreSQL database yet and want to create one for testing, you can use our guide on how to set up PostgreSQL in Docker.

The PostgreSQL in Docker guide is available [here](/docs/guides/postgresql-local-setup). Go set it up, generate a database URL (explained in the guide), and come back for the next steps
</Callout>

#### Step 3 - Setup Drizzle config file

<SetupConfig dialect='cockroach' env_variable='DATABASE_URL'/>

#### Step 4 - Introspect your database

<IntrospectCockroach/>

#### Step 5 - Transfer code to your actual schema file

<TransferCode/>

#### Step 6 - Connect Drizzle ORM to the database

<ConnectCockroach/>

#### Step 7 - Query the database

<QueryDatabase dialect='cockroach' env_variable='DATABASE_URL'/>

#### Step 8 - Run index.ts file

<RunFile/>

#### Step 9 - Update your table schema (optional)

<UpdateSchema/>

#### Step 10 - Applying changes to the database (optional)

<ApplyChanges />

#### Step 11 - Query the database with a new field (optional)

<QueryDatabaseUpdated dialect='cockroach' env_variable='DATABASE_URL' />

Source: https://orm.drizzle.team/docs/get-started/cockroach-new

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import Steps from '@mdx/Steps.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import ConnectCockroach from '@mdx/get-started/cockroach/ConnectCockroach.mdx'
import CreateTable from '@mdx/get-started/cockroach/CreateTable.mdx'
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import QueryDatabase from '@mdx/get-started/QueryDatabase.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and CockroachDB

<Callout type='error'>
This page explains concepts available on drizzle versions `1.0.0-beta.2` and higher.
</Callout>

<br/>

<Prerequisites>
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **node-postgres** - package for querying your PostgreSQL database - [read here](https://node-postgres.com/)
</Prerequisites>

Drizzle has native support for CockroachDB connections with the `node-postgres` and `postgres.js` drivers.

We will use `node-postgres` for this get started example. But if you want to find more ways to connect to postgresql check
our [CockroachDB Connection](/docs/get-started-cockroach) page 

<FileStructure/>

#### Step 1 - Install **node-postgres** package
<Npm>
  drizzle-orm@beta pg dotenv
  -D drizzle-kit@beta tsx @types/pg
</Npm>

#### Step 2 - Setup connection variables

<SetupEnv env_variable='DATABASE_URL' />

#### Step 3 - Connect Drizzle ORM to the database

<ConnectCockroach/>

#### Step 4 - Create a table

<CreateTable />

#### Step 5 - Setup Drizzle config file

<SetupConfig dialect='cockroach' env_variable='DATABASE_URL'/>

#### Step 6 - Applying changes to the database

<ApplyChanges />

#### Step 7 - Seed and Query the database

<QueryDatabase dialect='cockroach' env_variable='DATABASE_URL'/>

#### Step 8 - Run index.ts file

<RunFile/>

Source: https://orm.drizzle.team/docs/get-started/d1-existing

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import Steps from '@mdx/Steps.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import CodeTabs from "@mdx/CodeTabs.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import IntrospectSQLite from '@mdx/get-started/sqlite/IntrospectSqlite.mdx';
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';
import TransferCode from '@mdx/get-started/TransferCode.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import ConnectSQLiteCloud from '@mdx/get-started/sqlite/ConnectSQLiteCloud.mdx';
import QueryDatabase from '@mdx/get-started/QueryDatabase.mdx';
import QueryDatabaseUpdated from '@mdx/get-started/QueryDatabaseUpdated.mdx';
import UpdateSchema from '@mdx/get-started/sqlite/UpdateSchema.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and D1 in existing project

<Prerequisites>
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **Cloudflare D1** - Serverless SQL database to query from your Workers and Pages projects - [read here](https://developers.cloudflare.com/d1/)
  - **wrangler** - Cloudflare Developer Platform command-line interface - [read here](https://developers.cloudflare.com/workers/wrangler)
</Prerequisites>

<FileStructure/>

#### Step 1 - Install required package
<InstallPackages lib=''/>

#### Step 2 - Setup wrangler.toml

You would need to have a `wrangler.toml` file for D1 database and will look something like this:
```toml
name = "YOUR PROJECT NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "DB"
database_name = "YOUR DB NAME"
database_id = "YOUR DB ID"
migrations_dir = "drizzle"
```

#### Step 3 - Setup Drizzle config file

**Drizzle config** - a configuration file that is used by [Drizzle Kit](/docs/kit-overview) and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

```typescript copy filename="drizzle.config.ts"
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```
<Callout title='tips'>
You can check [our tutorial](/docs/guides/d1-http-with-drizzle-kit) on how to get env variables from CloudFlare
</Callout>

#### Step 4 - Introspect your database

<IntrospectSQLite/>

#### Step 5 - Transfer code to your actual schema file

<TransferCode/>

#### Step 6 - Connect Drizzle ORM to the database

```typescript copy
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
  },
};
```

#### Step 7 - Query the database

```typescript copy
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);

    const user: typeof usersTable.$inferInsert = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    };

    await db.insert(usersTable).values(user);
    console.log('New user created!');

    const users = await db.select().from(usersTable);
    console.log('Getting all users from the database: ', users);
    /*
    const users: {
      id: number;
      name: string;
      age: number;
      email: string;
    }[]
    */

    await db
      .update(usersTable)
      .set({
        age: 31,
      })
      .where(eq(usersTable.email, user.email));
    console.log('User info updated!');

    await db.delete(usersTable).where(eq(usersTable.email, user.email));
    console.log('User deleted!');

    return Response.json(users);
  },
};
```

#### Step 8 - Run index.ts file

<RunFile/>

#### Step 9 - Update your table schema (optional)

<UpdateSchema/>

#### Step 10 - Applying changes to the database (optional)

<ApplyChanges />

#### Step 11 - Query the database with a new field (optional)

```typescript copy filename="src/index.ts"
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/sqlite-cloud';
import { usersTable } from './db/schema';

async function main() {
  const db = drizzle(env.<BINDING_NAME>);

  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
    phone: '123-456-7890',
  };

  await db.insert(usersTable).values(user);
  console.log('New user created!');

  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
    phone: string | null;
  }[]
  */

  await db
    .update(usersTable)
    .set({
      age: 31,
    })
    .where(eq(usersTable.email, user.email));
  console.log('User info updated!');

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('User deleted!');

  return Response.json(users);
}

main();
```

Source: https://orm.drizzle.team/docs/get-started/d1-new

import Npm from '@mdx/Npm.astro';
import Npx from '@mdx/Npx.astro';
import Callout from '@mdx/Callout.astro';
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import WhatsNextPostgres from "@mdx/WhatsNextPostgres.astro";
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import TransferCode from '@mdx/get-started/TransferCode.mdx';
import QueryTurso from '@mdx/get-started/sqlite/QueryTurso.mdx';
import QueryDatabaseUpdated from '@mdx/get-started/QueryDatabaseUpdated.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';
import CreateTable from '@mdx/get-started/sqlite/CreateTable.mdx';
import ConnectLibsql from '@mdx/get-started/sqlite/ConnectLibsql.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and D1

<Prerequisites>  
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **Cloudflare D1** - Serverless SQL database to query from your Workers and Pages projects - [read here](https://developers.cloudflare.com/d1/)
  - **wrangler** - Cloudflare Developer Platform command-line interface - [read here](https://developers.cloudflare.com/workers/wrangler)
</Prerequisites>

<FileStructure />

#### Step 1 - Install required packages
<InstallPackages lib='wrangler'/>

#### Step 2 - Setup wrangler.toml

You would need to have a `wrangler.toml` file for D1 database and will look something like this:
```toml
name = "YOUR PROJECT NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "DB"
database_name = "YOUR DB NAME"
database_id = "YOUR DB ID"
migrations_dir = "drizzle"
```

#### Step 3 - Connect Drizzle ORM to the database

```typescript copy
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
  },
};
```

#### Step 4 - Generate wrangler types 

<Npx>
wrangler types
</Npx>

<Callout>
The output of this command will be a `worker-configuration.d.ts` file.
</Callout>

#### Step 5 - Create a table

<CreateTable/>

#### Step 6 - Setup Drizzle config file

**Drizzle config** - a configuration file that is used by [Drizzle Kit](/docs/kit-overview) and contains all the information about your database connection, migration folder and schema files.

Create a `drizzle.config.ts` file in the root of your project and add the following content:

```typescript copy filename="drizzle.config.ts"
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```
<Callout title='tips'>
You can check [our tutorial](/docs/guides/d1-http-with-drizzle-kit) on how to get env variables from CloudFlare
</Callout>

#### Step 7 - Applying changes to the database

<ApplyChanges />

#### Step 8 - Seed and Query the database

```typescript copy
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
    const result = await db.select().from(users).all()
    return Response.json(result);
  },
};
```

#### Step 9 - Run index.ts file

<RunFile/>

Source: https://orm.drizzle.team/docs/get-started/do-existing

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Npm from "@mdx/Npm.astro";
import Callout from '@mdx/Callout.astro';
import Steps from '@mdx/Steps.astro';
import AnchorCards from '@mdx/AnchorCards.astro';
import Breadcrumbs from '@mdx/Breadcrumbs.astro';
import CodeTabs from "@mdx/CodeTabs.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import IntrospectSQLite from '@mdx/get-started/sqlite/IntrospectSqlite.mdx';
import FileStructure from '@mdx/get-started/FileStructure.mdx';
import InstallPackages from '@mdx/get-started/InstallPackages.mdx';
import SetupConfig from '@mdx/get-started/SetupConfig.mdx';
import SetupEnv from '@mdx/get-started/SetupEnv.mdx';
import TransferCode from '@mdx/get-started/TransferCode.mdx';
import ApplyChanges from '@mdx/get-started/ApplyChanges.mdx';
import RunFile from '@mdx/get-started/RunFile.mdx';
import ConnectSQLiteCloud from '@mdx/get-started/sqlite/ConnectSQLiteCloud.mdx';
import QueryDatabase from '@mdx/get-started/QueryDatabase.mdx';
import QueryDatabaseUpdated from '@mdx/get-started/QueryDatabaseUpdated.mdx';
import UpdateSchema from '@mdx/get-started/sqlite/UpdateSchema.mdx';

<Breadcrumbs/>

# Get Started with Drizzle and SQLite Durable Objects in existing project

<Prerequisites>
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **Cloudflare SQLite Durable Objects** - SQLite database embedded within a Durable Object - [read here](https://developers.cloudflare.com/durable-objects/api/sql-storage/)
  - **wrangler** - Cloudflare Developer Platform command-line interface - [read here](https://developers.cloudflare.com/workers/wrangler)
</Prerequisites>

<FileStructure/>

#### Step 1 - Install required package
<InstallPackages lib=''/>

#### Step 2 - Setup wrangler.toml

You would need to have a `wrangler.toml` file for D1 database and will look something like this:
```toml
#:schema node_modules/wrangler/config-schema.json
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

