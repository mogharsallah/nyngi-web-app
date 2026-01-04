## Insert into ... select

As the SQLite documentation mentions:

<Callout>
The second form of the INSERT statement contains a SELECT statement instead of a VALUES clause. 
A new entry is inserted into the table for each row of data returned by executing the SELECT statement. 
If a column-list is specified, the number of columns in the result of the SELECT must be the same as 
the number of items in the column-list. Otherwise, if no column-list is specified, the number of 
columns in the result of the SELECT must be the same as the number of columns in the table. 
Any SELECT statement, including compound SELECTs and SELECT statements with ORDER BY and/or LIMIT clauses, 
may be used in an INSERT statement of this form.
</Callout>
<Callout type='warning'>
To avoid a parsing ambiguity, the SELECT statement should always contain a WHERE clause, even if that clause is simply "WHERE true", if the upsert-clause is present. Without the WHERE clause, the parser does not know if the token "ON" is part of a join constraint on the SELECT, or the beginning of the upsert-clause.
</Callout>

As the PostgreSQL documentation mentions:
<Callout>
A query (SELECT statement) that supplies the rows to be inserted
</Callout>

And as the MySQL documentation mentions:

<Callout>
With INSERT ... SELECT, you can quickly insert many rows into a table from the result of a SELECT statement, which can select from one or many tables
</Callout>

Drizzle supports the current syntax for all dialects, and all of them share the same syntax. Let's review some common scenarios and API usage. 
There are several ways to use select inside insert statements, allowing you to choose your preferred approach:

- You can pass a query builder inside the select function.
- You can use a query builder inside a callback.
- You can pass an SQL template tag with any custom select query you want to use


<Tabs items={["Query Builder", "Callback", "SQL template tag"]}>
<Tab>
<Section>
```ts
const insertedEmployees = await db
  .insert(employees)
  .select(
    db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
  )
  .returning({
    id: employees.id,
    name: employees.name
  });
```
```ts
const qb = new QueryBuilder();
await db.insert(employees).select(
    qb.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```
</Section>
</Tab>
<Tab>
<Section>
```ts
await db.insert(employees).select(
    () => db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```
```ts
await db.insert(employees).select(
    (qb) => qb.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```
</Section>
</Tab>
<Tab>
<Section>
```ts
await db.insert(employees).select(
    sql`select "users"."name" as "name" from "users" where "users"."role" = 'employee'`
);
```
```ts
await db.insert(employees).select(
    () => sql`select "users"."name" as "name" from "users" where "users"."role" = 'employee'`
);
```
</Section>
</Tab>
</Tabs>

Source: https://orm.drizzle.team/docs/joins

import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';
import Section from '@mdx/Section.astro';

