## `sql` in where

Indeed, Drizzle provides a set of available expressions that you can use within the sql template. 
However, it is true that databases often have a wider range of expressions available, 
including those provided through extensions or other means.

To ensure flexibility and enable you to utilize any expressions that are not natively
supported by Drizzle, you have the freedom to write the SQL template
directly using the sql function. This allows you to leverage the full power of
SQL and incorporate any expressions or functionalities specific to your target database.

By using the sql template, you are not restricted to only the predefined expressions in Drizzle. 
Instead, you can express complex queries and incorporate any supported expressions that 
the underlying database system provides.


**Filtering by `id` but with sql**
<Section>
```typescript copy
import { sql } from 'drizzle-orm'
import { usersTable } from 'schema'

const id = 77

await db.select()
        .from(usersTable)
        .where(sql`${usersTable.id} = ${id}`)
```
```sql
select * from "users" where "users"."id" = $1; --> [ 77 ]
```
</Section>

**Advanced fulltext search where statement**
<Section>
```typescript copy
import { sql } from 'drizzle-orm'
import { usersTable } from 'schema'

const searchParam = "Ale"

await db.select()
        .from(usersTable)
        .where(sql`to_tsvector('simple', ${usersTable.name}) @@ to_tsquery('simple', ${searchParam})`)
```
```sql
select * from "users" where to_tsvector('simple', "users"."name") @@ to_tsquery('simple', '$1'); --> [ "Ale" ]
```
</Section>

