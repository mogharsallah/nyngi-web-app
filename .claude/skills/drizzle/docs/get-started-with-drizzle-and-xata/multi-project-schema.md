## Multi-project schema
**Table creator** API lets you define customize table names.  
It's very useful when you need to keep schemas of different projects in one database.

<CodeTabs items={["PostgreSQL", "MySQL", "SQLite", "SingleStore", "MSSQL", "CockroachDB"]}>
```ts {3}
import { serial, text, pgTableCreator } from 'drizzle-orm/pg-core';

const pgTable = pgTableCreator((name) => `project1_${name}`);

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
```
```ts {3}
import { int, text, mysqlTableCreator } from 'drizzle-orm/mysql-core';

const mysqlTable = mysqlTableCreator((name) => `project1_${name}`);

const users = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
});
```
```ts {3}
import { int, text, sqliteTableCreator } from 'drizzle-orm/sqlite-core';

const sqliteTable = sqliteTableCreator((name) => `project1_${name}`);

const users = sqliteTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
});
```
```ts {3}
import { int, text, singlestoreTableCreator } from 'drizzle-orm/singlestore-core';

const singlestoreTable = singlestoreTableCreator((name) => `project1_${name}`);

const users = singlestoreTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
});
```
```ts {3}
import { int, text, mssqlTableCreator } from 'drizzle-orm/mssql-core';

const mssqlTable = mssqlTableCreator((name) => `project1_${name}`);

const users = mssqlTable('users', {
  id: int().primaryKey(),
  name: text().notNull(),
});
```
```ts {3}
import { int4, text, cockroachTableCreator } from 'drizzle-orm/cockroach-core';

const pgTable = cockroachTableCreator((name) => `project1_${name}`);

const users = pgTable('users', {
  id: int4().primaryKey(),
  name: text().notNull(),
});
```
</CodeTabs>
```ts {10}
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*",
  out: "./drizzle",
  dialect: "mysql", 
  dbCredentials: {
    url: process.env.DATABASE_URL,
  }
  tablesFilter: ["project1_*"],
});
```

You can apply multiple `or` filters:
```ts
tablesFilter: ["project1_*", "project2_*"]
```


