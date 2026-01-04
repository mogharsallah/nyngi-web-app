## `sql` in orderBy

The `sql` template can indeed be used in the ORDER BY clause when you need specific functionality for ordering that is not
available in Drizzle, but you prefer not to resort to raw SQL.

<Section>
```typescript copy
import { sql } from 'drizzle-orm'
import { usersTable } from 'schema'

await db.select().from(usersTable).orderBy(sql`${usersTable.id} desc nulls first`)
```
```sql
select * from "users" order by "users"."id" desc nulls first;
```
</Section>

