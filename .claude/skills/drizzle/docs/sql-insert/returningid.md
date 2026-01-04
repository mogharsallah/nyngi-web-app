## $returningId
<IsSupportedChipGroup chips={{ 'PostgreSQL': false, 'SQLite': false, 'MySQL': true, 'SingleStore': true, 'MSSQL': false, 'CockroachDB': false }} />

MySQL itself doesn't have native support for `RETURNING` after using `INSERT`. There is only one way to do it for `primary keys` with `autoincrement` (or `serial`) types, where you can access `insertId` and `affectedRows` fields. We've prepared an automatic way for you to handle such cases with Drizzle and automatically receive all inserted IDs as separate objects

```ts
import { boolean, int, text, mysqlTable } from 'drizzle-orm/mysql-core';

const usersTable = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
});


const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
//    ^? { id: number }[]
```

Also with Drizzle, you can specify a `primary key` with `$default` function that will generate custom primary keys at runtime. We will also return those generated keys for you in the `$returningId()` call

```ts
import { varchar, text, mysqlTable } from 'drizzle-orm/mysql-core';
import { createId } from '@paralleldrive/cuid2';

const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});


const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
//  ^? { customId: string }[]
```

> If there is no primary keys -> type will be `{}[]` for such queries

