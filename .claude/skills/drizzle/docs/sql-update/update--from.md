## Update ... from

<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'MySQL': false, 'SQLite': true, 'SingleStore': false, 'MSSQL': false, 'CockroachDB': true }} />

As the SQLite documentation mentions:

> The UPDATE-FROM idea is an extension to SQL that allows an UPDATE statement to be driven by other tables in the database. 
The "target" table is the specific table that is being updated. With UPDATE-FROM you can join the target table 
against other tables in the database in order to help compute which rows need updating and what 
the new values should be on those rows

Similarly, the PostgreSQL documentation states:

> A table expression allowing columns from other tables to appear in the WHERE condition and update expressions

Drizzle also supports this feature starting from version `drizzle-orm@0.36.3`

<Section>
```ts
await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .where(and(eq(cities.name, 'Seattle'), eq(users.name, 'John')))
```
```sql
update "users" set "city_id" = "cities"."id" 
from "cities" 
where ("cities"."name" = $1 and "users"."name" = $2)

-- params: [ 'Seattle', 'John' ]
```
</Section>

You can also alias tables that are joined (in PG, you can also alias the updating table too).
<Section>
```ts
const c = alias(cities, 'c');
await db
  .update(users)
  .set({ cityId: c.id })
  .from(c);
```
```sql
update "users" set "city_id" = "c"."id" 
from "cities" "c"
```
</Section>

<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'MySQL': false, 'SQLite': false, 'SingleStore': false, 'MSSQL': false, 'CockroachDB': true }} />

In Postgres, you can also return columns from the joined tables.
<Section>
```ts
const updatedUsers = await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .returning({ id: users.id, cityName: cities.name });
```
```sql
update "users" set "city_id" = "cities"."id" 
from "cities" 
returning "users"."id", "cities"."name"
```
</Section>

Source: https://orm.drizzle.team/docs/upgrade-21

import Callout from '@mdx/Callout.astro';

