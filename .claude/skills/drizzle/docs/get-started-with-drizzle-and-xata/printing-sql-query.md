## Printing SQL query
You can print SQL queries with `db` instance or by using **[`standalone query builder`](#standalone-query-builder)**.
```typescript copy
const query = db
  .select({ id: users.id, name: users.name })
  .from(users)
  .groupBy(users.id)
  .toSQL();
// query:
{
  sql: 'select 'id', 'name' from 'users' group by 'users'.'id'',
  params: [],
}
```

