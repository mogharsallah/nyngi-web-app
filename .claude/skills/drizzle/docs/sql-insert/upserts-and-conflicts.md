## Upserts and conflicts
Drizzle ORM provides simple interfaces for handling upserts and conflicts.

### On conflict do nothing
<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'SQLite': true, 'MySQL': false, 'SingleStore': false, 'CockroachDB': true }} />

`onConflictDoNothing` will cancel the insert if there's a conflict:

```typescript copy
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoNothing();

// explicitly specify conflict target
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoNothing({ target: users.id });
```

### On conflict do update

<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'SQLite': true, 'MySQL': false }} />

`onConflictDoUpdate` will update the row if there's a conflict:
```typescript
await db.insert(users)
  .values({ id: 1, name: 'Dan' })
  .onConflictDoUpdate({ target: users.id, set: { name: 'John' } });
```

#### `where` clauses

`on conflict do update` can have a `where` clause in two different places -
as part of the conflict target (i.e. for partial indexes) or as part of the `update` clause:

```sql
insert into employees (employee_id, name)
values (123, 'John Doe')
on conflict (employee_id) where name <> 'John Doe'
do update set name = excluded.name

insert into employees (employee_id, name)
values (123, 'John Doe')
on conflict (employee_id) do update set name = excluded.name
where name <> 'John Doe';
```

To specify these conditions in Drizzle, you can use `setWhere` and `targetWhere` clauses:

```typescript
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });

await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

<hr />

Upsert with composite indexes, or composite primary keys for `onConflictDoUpdate`:

```typescript
await db.insert(users)
  .values({ firstName: 'John', lastName: 'Doe' })
  .onConflictDoUpdate({
    target: [users.firstName, users.lastName],
    set: { firstName: 'John1' }
  });
```

### On duplicate key update
<IsSupportedChipGroup chips={{ 'PostgreSQL': false, 'SQLite': false, 'MySQL': true, 'SingleStore': true, 'CockroachDB': false }} />

MySQL supports [`ON DUPLICATE KEY UPDATE`](https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html) instead of `ON CONFLICT` clauses. MySQL will automatically determine the conflict target based on the primary key and unique indexes, and will update the row if *any* unique index conflicts.

Drizzle supports this through the `onDuplicateKeyUpdate` method:

```typescript
// Note that MySQL automatically determines targets based on the primary key and unique indexes
await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'John' } });
```

While MySQL does not directly support doing nothing on conflict, you can perform a no-op by setting any column's value to itself and achieve the same effect:

```typescript
import { sql } from 'drizzle-orm';

await db.insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { id: sql`id` } });
```

