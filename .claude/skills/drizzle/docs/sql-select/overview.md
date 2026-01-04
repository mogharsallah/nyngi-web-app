# SQL Select
Drizzle provides you the most SQL-like way to fetch data from your database, while remaining type-safe and composable.
It natively supports mostly every query feature and capability of every dialect,
and whatever it doesn't support yet, can be added by the user with the powerful [`sql`](/docs/sql) operator.

For the following examples, let's assume you have a `users` table defined like this:
<Tabs items={['PostgreSQL', 'MySQL', 'SQLite', 'SingleStore', 'MSSQL', 'CockroachDB']}>
<Tab>
```typescript
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age'),
});
```
</Tab>
<Tab>
```typescript
import { mysqlTable, serial, text, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: int('age'),
});
```
</Tab>
<Tab>
```typescript
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age'),
});
```
</Tab>
<Tab>
```typescript
import { singlestoreTable, serial, text, int } from 'drizzle-orm/singlestore-core';

export const users = singlestoreTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  age: int('age'),
});
```
</Tab>
<Tab>
```typescript
import { mssqlTable, int, text } from 'drizzle-orm/mssql-core';

export const users = pgTable('users', {
  id: int().primaryKey(),
  name: text().notNull(),
  age: int(),
});
```
</Tab>
<Tab>
```typescript
import { cockroachTable, int4, text } from 'drizzle-orm/cockroach-core';

export const users = pgTable('users', {
  id: int4().primaryKey(),
  name: text().notNull(),
  age: int4(),
});
```
</Tab>
</Tabs>

### Basic select
Select all rows from a table including all columns:

<Section>
```typescript
const result = await db.select().from(users);
/*
  {
    id: number;
    name: string;
    age: number | null;
  }[]
*/
```
```sql
select "id", "name", "age" from "users";
```
</Section>

Notice that the result type is inferred automatically based on the table definition, including columns nullability.

<Callout type="info">
Drizzle always explicitly lists columns in the `select` clause instead of using `select *`.<br />
This is required internally to guarantee the fields order in the query result, and is also generally considered a good practice.
</Callout>

### Partial select
In some cases, you might want to select only a subset of columns from a table.
You can do that by providing a selection object to the `.select()` method:
<Section>
```typescript copy
const result = await db.select({
  field1: users.id,
  field2: users.name,
}).from(users);

const { field1, field2 } = result[0];
```
```sql
select "id", "name" from "users";
```
</Section>

Like in SQL, you can use arbitrary expressions as selection fields, not just table columns:

<Section>
```typescript
const result = await db.select({
  id: users.id,
  lowerName: sql<string>`lower(${users.name})`,
}).from(users);
```
```sql
select "id", lower("name") from "users";
```
</Section>

<Callout type="warning">
By specifying `sql<string>`, you are telling Drizzle that the **expected** type of the field is `string`.<br />
If you specify it incorrectly (e.g. use `sql<number>` for a field that will be returned as a string), the runtime value won't match the expected type.
Drizzle cannot perform any type casts based on the provided type generic, because that information is not available at runtime.

If you need to apply runtime transformations to the returned value, you can use the [`.mapWith()`](/docs/sql#sqlmapwith) method.
</Callout>

<Callout title='Info'>
Starting from `v1.0.0-beta.1` you can use `.as()` for columns:

```ts
const result = await db.select({
  id: users.id,
  lowerName: users.name.as("lower"),
}).from(users);
```
</Callout>

### Conditional select

You can have a dynamic selection object based on some condition:

```typescript
async function selectUsers(withName: boolean) {
  return db
    .select({
      id: users.id,
      ...(withName ? { name: users.name } : {}),
    })
    .from(users);
}

const users = await selectUsers(true);
```

### Distinct select

You can use `.selectDistinct()` instead of `.select()` to retrieve only unique rows from a dataset:
<Section>
```ts
await db.selectDistinct().from(users).orderBy(users.id, users.name);

await db.selectDistinct({ id: users.id }).from(users).orderBy(users.id);
```
```sql
select distinct "id", "name" from "users" order by "id", "name";

select distinct "id" from "users" order by "id";
```
</Section>

In PostgreSQL, you can also use the `distinct on` clause to specify how the unique rows are determined:
<Callout type='warning'>
`distinct on` clause is only supported in PostgreSQL.
</Callout>
<Section>
```ts
await db.selectDistinctOn([users.id]).from(users).orderBy(users.id);
await db.selectDistinctOn([users.name], { name: users.name }).from(users).orderBy(users.name);
```
```sql
select distinct on ("id") "id", "name" from "users" order by "id";
select distinct on ("name") "name" from "users" order by "name";
```
</Section>



### Advanced select
Powered by TypeScript, Drizzle APIs let you build your select queries in a variety of flexible ways.

Sneak peek of advanced partial select, for more detailed advanced usage examples - see our [dedicated guide](/docs/guides/include-or-exclude-columns).
<CodeTabs items={["example 1", "example 2", "example 3", "example 4"]}>
```ts
import { getTableColumns, sql } from 'drizzle-orm';

await db.select({
    ...getTableColumns(posts),
    titleLength: sql<number>`length(${posts.title})`,
  }).from(posts);
```
```ts
import { getTableColumns } from 'drizzle-orm';

const { content, ...rest } = getTableColumns(posts); // exclude "content" column
await db.select({ ...rest }).from(posts); // select all other columns
```
```ts
await db.query.posts.findMany({
  columns: {
    title: true,
  },
});
```
```ts
await db.query.posts.findMany({
  columns: {
    content: false,
  },
});
```
</CodeTabs>

