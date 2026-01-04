## Example 3

<CodeTabs items={["index.ts", "schema.ts"]}>
<CodeTab>
```ts copy{6-9}
import { users } from './schema.ts';

async function main() {
    const db = drizzle(...);
    await seed(db, { users }).refine(() => ({
        users: {
            count: 2,
            with: {
                users: 3,
            },
        },
    }));
}
main();

```
</CodeTab>

<CodeTab>
```ts
import { serial, pgTable, integer, text } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name'),
    reportsTo: integer('reports_to').references((): AnyPgColumn => users.id),
});
```
</CodeTab>
</CodeTabs>

Running the seeding script above will cause an error.

```
Error: "users" table has self reference.
You can't specify "users" as parameter in users.with object.
```

<Callout title='Why?'>
You have a `users` table referencing a `users` table in your schema, 
```ts copy{7}
.
.
.
export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name'),
    reportsTo: integer('reports_to').references((): AnyPgColumn => users.id),
});
```
or in other words, you have one-to-one relation where `one` user can have only `one` user.

However, in your seeding script, you're attempting to generate 3 (`many`) users for `one` user, which is impossible.
```ts
users: {
    count: 2,
    with: {
        users: 3,
    },
},
```
</Callout>

Source: https://orm.drizzle.team/docs/seeding-with-partially-exposed-tables


import IsSupportedChipGroup from "@mdx/IsSupportedChipGroup.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';
import Callout from '@mdx/Callout.astro';

<IsSupportedChipGroup chips={{PostgreSQL: true, MySQL: true, SQLite: true}}/>

<Prerequisites>
- Get started with [PostgreSQL](/docs/get-started-postgresql), [MySQL](/docs/get-started-mysql) or [SQLite](/docs/get-started-sqlite)
- Get familiar with [Drizzle Seed](/docs/seed-overview)
</Prerequisites>

