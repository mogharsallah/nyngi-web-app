## `sql` in having and groupBy

The `sql` template can indeed be used in the HAVING and GROUP BY clauses when you need specific functionality for ordering that is not
available in Drizzle, but you prefer not to resort to raw SQL.

<Section>
```typescript copy
import { sql } from 'drizzle-orm'
import { usersTable } from 'schema'

await db.select({ 
    projectId: usersTable.projectId,
    count: sql<number>`count(${usersTable.id})`.mapWith(Number)
}).from(usersTable)
    .groupBy(sql`${usersTable.projectId}`)
    .having(sql`count(${usersTable.id}) > 300`)
```
```sql
select "project_id", count("users"."id") from users group by "users"."project_id" having count("users"."id") > 300; 
```
</Section>


Source: https://orm.drizzle.team/docs/transactions

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';

