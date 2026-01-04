## Example 2

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
	userId: integer().references(() => users.id),
})
```
</CodeTab>
</CodeTabs>

By running the seeding script above you will see a warning
```
Column 'userId' in 'bloodPressure' table will be filled with Null values
because you specified neither a table for foreign key on column 'userId' 
nor a function for 'userId' column in refinements.
```
<Callout title='What does it mean?'>
This means you neither provided the `users` table to the `seed` function schema nor refined the `userId` column generator. 
As a result, the `userId` column will be filled with Null values.
</Callout>
Then you will have two choices:
- If you're okay with filling the `userId` column with Null values, you can ignore the warning;

- Otherwise, you can [refine](/docs/guides/seeding-with-partially-exposed-tables#refining-the-userid-column-generator) the `userId` column generator. 

