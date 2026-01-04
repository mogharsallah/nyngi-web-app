# Drizzle schema

Drizzle lets you define a schema in TypeScript with various models and properties supported by the underlying database. 
When you define your schema, it serves as the source of truth for future modifications in queries (using Drizzle-ORM)
and migrations (using Drizzle-Kit).

<Callout> 
If you are using Drizzle-Kit for the migration process, make sure to export all the models defined in your schema files so that Drizzle-Kit can import them and use them in the migration diff process. 
</Callout>

<CodeTabs items={["Using imports", "Using callback", "Using import *"]}>
```ts
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  age: integer().notNull(),
  email: varchar().notNull().unique(),
});
```
```ts
import { pgTable } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar().notNull(),
  age: t.integer().notNull(),
  email: t.varchar().notNull().unique(),
}));
```
```ts
import * as p from "drizzle-orm/pg-core";

export const usersTable = p.pgTable("users", {
  id: p.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: p.varchar().notNull(),
  age: p.integer().notNull(),
  email: p.varchar().notNull().unique(),
});
```
</CodeTabs>

