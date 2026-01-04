## Type API
To retrieve a type from your table schema for `select` and `insert` queries, you can make use of our type helpers.

<Tabs items={["PostgreSQL", "MySQL", "SQLite", "SingleStore", "MSSQL", "CockroachDB"]}>
<Tab>
```ts
import { serial, text, pgTable } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
// or
type SelectUser = typeof users._.$inferSelect;
type InsertUser = typeof users._.$inferInsert;
// or
type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;
```
</Tab>
<Tab>
```ts
import { int, text, mysqlTable } from 'drizzle-orm/mysql-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

const users = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
// or
type SelectUser = typeof users._.$inferSelect;
type InsertUser = typeof users._.$inferInsert;
// or
type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;
```
</Tab>
<Tab>
```ts
import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

const users = sqliteTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
// or
type SelectUser = typeof users._.$inferSelect;
type InsertUser = typeof users._.$inferInsert;
// or
type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;
```
</Tab>
<Tab>
```ts
import { int, text, singlestoreTable } from 'drizzle-orm/singlestore-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

const users = singlestoreTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
// or
type SelectUser = typeof users._.$inferSelect;
type InsertUser = typeof users._.$inferInsert;
// or
type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;
```
</Tab>
<Tab>
```ts
import { int, text, mssqlTable } from 'drizzle-orm/mssql-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

const users = mssqlTable('users', {
  id: int().primaryKey(),
  name: text().notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
// or
type SelectUser = typeof users._.$inferSelect;
type InsertUser = typeof users._.$inferInsert;
// or
type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;
```
</Tab>
<Tab>
```ts
import { int4, text, cockroachTable } from 'drizzle-orm/cockroach-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

const users = cockroachTable('users', {
  id: int4().primaryKey(),
  name: text().notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
// or
type SelectUser = typeof users._.$inferSelect;
type InsertUser = typeof users._.$inferInsert;
// or
type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;
```
</Tab>
</Tabs>


