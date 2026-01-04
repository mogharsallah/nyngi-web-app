## sql`` template

One of the most common usages you may encounter in other ORMs as well 
is the ability to use `sql` queries as-is for raw queries.

```typescript copy
import { sql } from 'drizzle-orm' 

const id = 69;
await db.execute(sql`select * from ${usersTable} where ${usersTable.id} = ${id}`)
```

It will generate the current query

```sql
select * from "users" where "users"."id" = $1; --> [69]
```

Any tables and columns provided to the sql parameter are automatically mapped to their corresponding SQL 
syntax with escaped names for tables, and the escaped table names are appended to column names. 

Additionally, any dynamic parameters such as `${id}` will be mapped to the $1 placeholder, 
and the corresponding values will be moved to an array of values that are passed separately to the database. 

This approach effectively prevents any potential SQL Injection vulnerabilities.

