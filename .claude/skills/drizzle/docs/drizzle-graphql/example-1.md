## Example 1
Let's assume you are trying to seed your database using the seeding script and schema shown below.
<CodeTabs items={["index.ts", "schema.ts"]}>
<CodeTab>
```ts
import { bloodPressure } from './schema.ts';

async function main() {
  const db = drizzle(...);
  await seed(db, { bloodPressure });
}
main();

```
</CodeTab>

<CodeTab>
```ts copy {10}
import { serial, pgTable, integer, doublePrecision } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
});

export const bloodPressure = pgTable("bloodPressure", {
	bloodPressureId: serial().primaryKey(),
	pressure: doublePrecision(),
	userId: integer().references(() => users.id).notNull(),
})
```
</CodeTab>
</CodeTabs>
If the `bloodPressure` table has a not-null constraint on the `userId` column, running the seeding script will cause an error.

```
Error: Column 'userId' has not null constraint, 
and you didn't specify a table for foreign key on column 'userId' in 'bloodPressure' table.
```

<Callout title='What does it mean?'>
This means we can't fill the `userId` column with Null values due to the not-null constraint on that column. 
Additionally, you didn't expose the `users` table to the `seed` function schema, so we can't generate `users.id` to populate the `userId` column with these values.
</Callout>


At this point, you have several options to resolve the error:
- You can remove the not-null constraint from the `userId` column;
- You can expose `users` table to `seed` function schema
```ts 
await seed(db, { bloodPressure, users });
```
- You can [refine](/docs/guides/seeding-with-partially-exposed-tables#refining-the-userid-column-generator) the `userId` column generator;

