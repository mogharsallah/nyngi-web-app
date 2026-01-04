# SQL Update

```typescript copy
await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'));
```

The object that you pass to `update` should have keys that match column names in your database schema.
Values of `undefined` are ignored in the object: to set a column to `null`, pass `null`.
You can pass SQL as a value to be used in the update object, like this:

```typescript copy
await db.update(users)
  .set({ updatedAt: sql`NOW()` })
  .where(eq(users.name, 'Dan'));
```

### Limit

<IsSupportedChipGroup chips={{ 'PostgreSQL': false, 'MySQL': true, 'SQLite': true, 'SingleStore': true, 'MSSQL': false, 'CockroachDB': false }} />

Use `.limit()` to add `limit` clause to the query - for example:
<Section>
```typescript
await db.update(usersTable).set({ verified: true }).limit(2);
```
```sql
update "users" set "verified" = $1 limit $2;
```
</Section>

### Order By
Use `.orderBy()` to add `order by` clause to the query, sorting the results by the specified fields:
<Section>
```typescript
import { asc, desc } from 'drizzle-orm';

await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name);
await db.update(usersTable).set({ verified: true }).orderBy(desc(usersTable.name));

// order by multiple fields
await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name, usersTable.name2);
await db.update(usersTable).set({ verified: true }).orderBy(asc(usersTable.name), desc(usersTable.name2));
```
```sql
update "users" set "verified" = $1 order by "name";
update "users" set "verified" = $1 order by "name" desc;

update "users" set "verified" = $1 order by "name", "name2";
update "users" set "verified" = $1 order by "name" asc, "name2" desc;
```
</Section>

### Returning
<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'SQLite': true, 'MySQL': false , 'SingleStore': false, 'MSSQL': false, 'CockroachDB': true }} />
You can update a row and get it back in PostgreSQL and SQLite:
```typescript copy
const updatedUserId: { updatedId: number }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .returning({ updatedId: users.id });
```

### Output
<IsSupportedChipGroup chips={{ 'MSSQL': true }} />
You can update a row and get back the row before updated and after:

```typescript copy
type User = typeof users.$inferSelect;

const updatedUserId: User[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .output();
```

To return partial users after update: 

```ts
const updatedUserId: { inserted: { updatedId: number }}[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .output({ inserted: { updatedId: users.id }});
```

To return rows that were in database before update:

```ts
type User = typeof users.$inferSelect;

const updatedUserId: { deleted: User }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .output({ deleted: true });
```

To return both previous and new version on a row:

```ts
type User = typeof users.$inferSelect;

const updatedUserId: { deleted: User, inserted: User }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .output({ deleted: true, inserted: true });
```

