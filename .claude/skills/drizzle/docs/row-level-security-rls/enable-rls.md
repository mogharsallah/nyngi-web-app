## Enable RLS

<Callout type='warning' collapsed="How it works in 0.x versions">
If you just want to enable RLS on a table without adding policies, you can use `.enableRLS()`

As mentioned in the PostgreSQL documentation:

> If no policy exists for the table, a default-deny policy is used, meaning that no rows are visible or can be modified. 
Operations that apply to the whole table, such as TRUNCATE and REFERENCES, are not subject to row security.

```ts
import { integer, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: integer(),
}).enableRLS();
```
</Callout>

Starting from `v1.0.0-beta.1` `.enableRLS()` is deprecated and 
if you just want to enable RLS on a table without adding policies, you can use `pgTable.withRLS(...)`

As mentioned in the PostgreSQL documentation:

> If no policy exists for the table, a default-deny policy is used, meaning that no rows are visible or can be modified. 
Operations that apply to the whole table, such as TRUNCATE and REFERENCES, are not subject to row security.

```ts
import { integer, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable.withRLS('users', {
	id: integer(),
});
```

<Callout title='important'>
If you add a policy to a table, RLS will be enabled automatically. So, there’s no need to explicitly enable RLS when adding policies to a table.
</Callout>

