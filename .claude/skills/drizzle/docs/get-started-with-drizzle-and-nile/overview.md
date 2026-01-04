# Get Started with Drizzle and Nile

<Prerequisites>
  - **dotenv** - package for managing environment variables - [read here](https://www.npmjs.com/package/dotenv)
  - **tsx** - package for running TypeScript files - [read here](https://tsx.is/)
  - **Nile** - PostgreSQL re-engineered for multi-tenant apps - [read here](https://thenile.dev/)
</Prerequisites>

<FileStructure/>

#### Step 1 - Install **postgres** package
<InstallPackages lib='pg' devlib=' @types/pg'/>

#### Step 2 - Setup connection variables

<SetupEnv env_variable='NILEDB_URL' />

#### Step 3 - Connect Drizzle ORM to the database

<ConnectNile />

#### Step 4 - Create a table

Create a `schema.ts` file in the `src/db` directory and declare your tables. Since Nile is Postgres for multi-tenant apps, our schema includes a table for tenants and a todos table with a `tenant_id` column (we refer to those as tenant-aware tables):

```typescript copy filename="src/db/schema.ts"
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenantsTable = pgTable("tenants", {
	id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
	name: text(),
	created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	deleted: timestamp({ mode: 'string' }),
});

export const todos = pgTable("todos", {
	id: uuid().defaultRandom(),
	tenantId: uuid("tenant_id"),
	title: varchar({ length: 256 }),
	estimate: varchar({ length: 256 }),
	embedding: vector({ dimensions: 3 }),
	complete: boolean(),
});
```

#### Step 5 - Setup Drizzle config file

<SetupConfig dialect='postgresql' env_variable='NILEDB_URL'/>

#### Step 6 - Applying changes to the database

<ApplyChanges dialect='postgresql'/>

#### Step 7 - Seed and Query the database

<QueryNile />

#### Step 8 - Run index.ts file

<RunFile/>

Source: https://orm.drizzle.team/docs/get-started/op-sqlite-existing

import Breadcrumbs from '@mdx/Breadcrumbs.astro';

<Breadcrumbs/>

