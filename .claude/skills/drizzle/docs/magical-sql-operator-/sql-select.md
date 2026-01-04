## `sql` select

You can use the sql functionality in partial select queries as well. Partial select queries allow you to 
retrieve specific fields or columns from a table rather than fetching the entire row.

For more detailed information about partial select queries, you can refer to the Core API
documentation available at **[Core API docs](/docs/select#basic-and-partial-select)**.

**Select different custom fields from table**

Here you can see a usage for **[`sql<T>`](/docs/sql#sqlt)**, **[`sql``.mapWith()`](/docs/sql#sqlmapwith)**, **[`sql``.as<T>()`](/docs/sql#sqlast)**.

<Section>
```typescript copy
import { sql } from 'drizzle-orm'
import { usersTable } from 'schema'

await db.select({
    id: usersTable.id,
    lowerName: sql<string>`lower(${usersTable.name})`,
    aliasedName: sql<string>`lower(${usersTable.name})`.as('aliased_column'),
    count: sql<number>`count(*)`.mapWith(Number) 
}).from(usersTable)
```
```sql
select `id`, lower(`name`), lower(`name`) as `aliased_column`, count(*) from `users`;
```
</Section>

