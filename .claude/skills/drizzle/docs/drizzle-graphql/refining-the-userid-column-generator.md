## Refining the `userId` column generator
Doing so requires the `users` table to already have IDs such as 1 and 2 in the database.
<CodeTabs items={["index.ts"]}>
<CodeTab>
```ts copy {8}
import { bloodPressure } from './schema.ts';

async function main() {
  const db = drizzle(...);
  await seed(db, { bloodPressure }).refine((funcs) => ({
    bloodPressure: {
      columns: {
        userId: funcs.valuesFromArray({ values: [1, 2] })
      }
    }
  }));
}
main();

```
</CodeTab>
</CodeTabs>

Source: https://orm.drizzle.team/docs/select-parent-rows-with-at-least-one-related-child-row


import Prerequisites from "@mdx/Prerequisites.astro";
import IsSupportedChipGroup from "@mdx/IsSupportedChipGroup.astro";
import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';
import Section from "@mdx/Section.astro";

<IsSupportedChipGroup chips={{PostgreSQL: true, MySQL: true, SQLite: true}}/>

<Prerequisites>
- Get started with [PostgreSQL](/docs/get-started-postgresql), [MySQL](/docs/get-started-mysql) and [SQLite](/docs/get-started-sqlite)
- [Select statement](/docs/select) and [select from subquery](/docs/select#select-from-subquery)
- [Inner join](/docs/joins#inner-join)
- [Filter operators](/docs/operators) and [exists function](/docs/operators#exists)
</Prerequisites>

This guide demonstrates how to select parent rows with the condition of having at least one related child row. Below, there are examples of schema definitions and the corresponding database data:

  ```ts copy
  import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  });

  export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: integer('user_id').notNull().references(() => users.id),
  });
  ```

<CodeTabs items={["users.db", "posts.db"]}>
  <CodeTab>
    ```plaintext
    +----+------------+----------------------+
    | id |    name    |        email         |
    +----+------------+----------------------+
    |  1 | John Doe   | john_doe@email.com   |
    +----+------------+----------------------+
    |  2 | Tom Brown  | tom_brown@email.com  |
    +----+------------+----------------------+
    |  3 | Nick Smith | nick_smith@email.com |
    +----+------------+----------------------+
    ```
  </CodeTab>

  <CodeTab>
    ```plaintext
    +----+--------+-----------------------------+---------+
    | id | title  |          content            | user_id |
    +----+--------+-----------------------------+---------+
    |  1 | Post 1 | This is the text of post 1  |       1 |
    +----+--------+-----------------------------+---------+
    |  2 | Post 2 | This is the text of post 2  |       1 |
    +----+--------+-----------------------------+---------+
    |  3 | Post 3 | This is the text of post 3  |       3 |
    +----+--------+-----------------------------+---------+
    ```
  </CodeTab>
</CodeTabs>

To select parent rows with at least one related child row and retrieve child data you can use `.innerJoin()` method:

<Section>
  ```ts copy {12}
  import { eq } from 'drizzle-orm';
  import { users, posts } from './schema';

  const db = drizzle(...);

  await db
    .select({
      user: users,
      post: posts,
    })
    .from(users)
    .innerJoin(posts, eq(users.id, posts.userId));
    .orderBy(users.id);
  ```

  ```sql
  select users.*, posts.* from users
    inner join posts on users.id = posts.user_id
    order by users.id;
  ```

  ```ts
  // result data, there is no user with id 2 because he has no posts
  [
    {
      user: { id: 1, name: 'John Doe', email: 'john_doe@email.com' },
      post: {
        id: 1,
        title: 'Post 1',
        content: 'This is the text of post 1',
        userId: 1
      }
    },
    {
      user: { id: 1, name: 'John Doe', email: 'john_doe@email.com' },
      post: {
        id: 2,
        title: 'Post 2',
        content: 'This is the text of post 2',
        userId: 1
      }
    },
    {
      user: { id: 3, name: 'Nick Smith', email: 'nick_smith@email.com' },
      post: {
        id: 3,
        title: 'Post 3',
        content: 'This is the text of post 3',
        userId: 3
      }
    }
  ]
  ```
</Section>

To only select parent rows with at least one related child row you can use subquery with `exists()` function like this:

<Section>
```ts copy {8}
import { eq, exists, sql } from 'drizzle-orm';

const sq = db
  .select({ id: sql`1` })
  .from(posts)
  .where(eq(posts.userId, users.id));

await db.select().from(users).where(exists(sq));
```

```sql
select * from users where exists (select 1 from posts where posts.user_id = users.id);
```

```ts
// result data, there is no user with id 2 because he has no posts
[
  { id: 1, name: 'John Doe', email: 'john_doe@email.com' },
  { id: 3, name: 'Nick Smith', email: 'nick_smith@email.com' }
]
```
</Section>


Source: https://orm.drizzle.team/docs/timestamp-default-value


import Section from "@mdx/Section.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';

<Prerequisites>
- Get started with [PostgreSQL](/docs/get-started-postgresql), [MySQL](/docs/get-started-mysql) and [SQLite](/docs/get-started-sqlite)
- Learn about column data types for [PostgreSQL](/docs/column-types/pg), [MySQL](/docs/column-types/mysql) and [SQLite](/docs/column-types/sqlite)
- [sql operator](/docs/sql)
</Prerequisites>

### PostgreSQL

To set current timestamp as a default value in PostgreSQL, you can use the `defaultNow()` method or `sql` operator with `now()` function which returns the current date and time with the time zone:

<Section>
```ts copy {6,9}
import { sql } from 'drizzle-orm';
import { timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
});
```

```sql
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp1" timestamp DEFAULT now() NOT NULL,
	"timestamp2" timestamp DEFAULT now() NOT NULL
);
```
</Section>

The `mode` option defines how values are handled in the application. Values with `string` mode are treated as `string` in the application, but stored as timestamps in the database.

<Section>
```plaintext
// Data stored in the database
+----+----------------------------+----------------------------+
| id |         timestamp1         |         timestamp2         |
+----+----------------------------+----------------------------+
| 1  | 2024-04-11 14:14:28.038697 | 2024-04-11 14:14:28.038697 |
+----+----------------------------+----------------------------+
```

```ts
// Data returned by the application
[
  {
    id: 1,
    timestamp1: 2024-04-11T14:14:28.038Z, // Date object
    timestamp2: '2024-04-11 14:14:28.038697' // string
  }
]
```
</Section>

To set unix timestamp as a default value in PostgreSQL, you can use the `sql` operator and `extract(epoch from now())` function which returns the number of seconds since `1970-01-01 00:00:00 UTC`:

<Section>
```ts copy {8}
import { sql } from 'drizzle-orm';
import { integer, pgTable, serial } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp: integer('timestamp')
    .notNull()
    .default(sql`extract(epoch from now())`),
});
```

```sql
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" integer DEFAULT extract(epoch from now()) NOT NULL
);
```

```plaintext
// Data stored in the database
+----+------------+
| id | timestamp  |
+----+------------+
|  1 | 1712846784 |
+----+------------+
```

```ts
// Data returned by the application
[ 
  { 
    id: 1, 
    timestamp: 1712846784 // number
  } 
]
```
</Section>


### MySQL

To set current timestamp as a default value in MySQL, you can use the `defaultNow()` method or `sql` operator with `now()` function which returns the current date and time `(YYYY-MM-DD HH-MM-SS)`:

<Section>
```ts copy {6,9,12}
import { sql } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
  timestamp3: timestamp('timestamp3', { fsp: 3 }) // fractional seconds part
    .notNull()
    .default(sql`now(3)`),
});
```

```sql
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`timestamp1` timestamp NOT NULL DEFAULT now(),
	`timestamp2` timestamp NOT NULL DEFAULT now(),
	`timestamp3` timestamp(3) NOT NULL DEFAULT now(3),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
```
</Section>

`fsp` option defines the number of fractional seconds to include in the timestamp. The default value is `0`.
The `mode` option defines how values are handled in the application. Values with `string` mode are treated as `string` in the application, but stored as timestamps in the database.

<Section>
```plaintext
// Data stored in the database
+----+---------------------+---------------------+-------------------------+
| id | timestamp1          | timestamp2          | timestamp3              |
+----+---------------------+---------------------+-------------------------+
|  1 | 2024-04-11 15:24:53 | 2024-04-11 15:24:53 | 2024-04-11 15:24:53.236 |
+----+---------------------+---------------------+-------------------------+
```

```ts
// Data returned by the application
[
  {
    id: 1,
    timestamp1: 2024-04-11T15:24:53.000Z, // Date object
    timestamp2: '2024-04-11 15:24:53', // string
    timestamp3: 2024-04-11T15:24:53.236Z // Date object
  }
]
```
</Section>

To set unix timestamp as a default value in MySQL, you can use the `sql` operator and `unix_timestamp()` function which returns the number of seconds since `1970-01-01 00:00:00 UTC`:

<Section>
```ts copy {8}
import { sql } from 'drizzle-orm';
import { mysqlTable, serial, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp: int('timestamp')
    .notNull()
    .default(sql`(unix_timestamp())`),
});
```

```sql
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`timestamp` int NOT NULL DEFAULT (unix_timestamp()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
```

```plaintext
// Data stored in the database
+----+------------+
| id | timestamp  |
+----+------------+
|  1 | 1712847986 |
+----+------------+
```

```ts
// Data returned by the application
[ 
  { 
    id: 1, 
    timestamp: 1712847986 // number
  } 
]
```
</Section>

### SQLite

To set current timestamp as a default value in SQLite, you can use `sql` operator with `current_timestamp` constant which returns text representation of the current UTC date and time `(YYYY-MM-DD HH:MM:SS)`:

<Section>
```ts copy {8}
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp: text('timestamp')
    .notNull()
    .default(sql`(current_timestamp)`),
});
```

```sql
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL
);
```

```plaintext
// Data stored in the database
+----+---------------------+
| id | timestamp           |
+----+---------------------+
|  1 | 2024-04-11 15:40:43 |
+----+---------------------+
```

```ts
// Data returned by the application
[
  {
    id: 1,
    timestamp: '2024-04-11 15:40:43' // string
  }
]
```
</Section>

To set unix timestamp as a default value in SQLite, you can use the `sql` operator and `unixepoch()` function which returns the number of seconds since `1970-01-01 00:00:00 UTC`:

<Section>
```ts copy {8,11,14}
import { sql } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp1: integer('timestamp1', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  timestamp2: integer('timestamp2', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  timestamp3: integer('timestamp3', { mode: 'number' })
    .notNull()
    .default(sql`(unixepoch())`),
});
```

```sql
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`timestamp1` integer DEFAULT (unixepoch()) NOT NULL,
	`timestamp2` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`timestamp3` integer DEFAULT (unixepoch()) NOT NULL
);
```
</Section>

The `mode` option defines how values are handled in the application. In the application, values with `timestamp` and `timestamp_ms` modes are treated as `Date` objects, but stored as integers in the database.
The difference is that `timestamp` handles seconds, while `timestamp_ms` handles milliseconds.

<Section>
```plaintext
// Data stored in the database
+------------+------------+---------------+------------+
| id         | timestamp1 | timestamp2    | timestamp3 |
+------------+------------+---------------+------------+
| 1          | 1712835640 | 1712835640000 | 1712835640 |
+------------+------------+---------------+------------+
```

```ts
// Data returned by the application
[
  {
    id: 1,
    timestamp1: 2024-04-11T11:40:40.000Z, // Date object
    timestamp2: 2024-04-11T11:40:40.000Z, // Date object
    timestamp3: 1712835640 // number
  }
]
```
</Section>


Source: https://orm.drizzle.team/docs/toggling-a-boolean-field

import Section from "@mdx/Section.astro";
import IsSupportedChipGroup from "@mdx/IsSupportedChipGroup.astro";
import Prerequisites from "@mdx/Prerequisites.astro";

<IsSupportedChipGroup chips={{PostgreSQL: true, MySQL: true, SQLite: true}}/>

<Prerequisites>
- Get started with [PostgreSQL](/docs/get-started-postgresql), [MySQL](/docs/get-started-mysql) and [SQLite](/docs/get-started-sqlite)
- [Update statement](/docs/update)
- [Filters](/docs/operators) and [not operator](/docs/operators#not)
- Boolean data type in [MySQL](/docs/column-types/mysql#boolean) and [SQLite](/docs/column-types/sqlite#boolean)
</Prerequisites>

To toggle a column value you can use `update().set()` method like below:

<Section>
```tsx copy {8}
import { eq, not } from 'drizzle-orm';

const db = drizzle(...);

await db
  .update(table)
  .set({
    isActive: not(table.isActive),
  })
  .where(eq(table.id, 1));
```

```sql
update "table" set "is_active" = not "is_active" where "id" = 1;
```
</Section>

Please note that there is no boolean type in MySQL and SQLite.
MySQL uses tinyint(1).
SQLite uses integers 0 (false) and 1 (true). 


Source: https://orm.drizzle.team/docs/unique-case-insensitive-email


import Section from "@mdx/Section.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';
import Callout from '@mdx/Callout.astro';

<Prerequisites>
- Get started with [PostgreSQL](/docs/get-started-postgresql), [MySQL](/docs/get-started-mysql) and [SQLite](/docs/get-started-sqlite)
- [Indexes](/docs/indexes-constraints#indexes)
- [Insert statement](/docs/insert) and [Select method](/docs/select)
- [sql operator](/docs/sql)
- You should have `drizzle-orm@0.31.0` and `drizzle-kit@0.22.0` or higher.
</Prerequisites>

### PostgreSQL

To implement a unique and case-insensitive `email` handling in PostgreSQL with Drizzle, you can create a unique index on the lowercased `email` column. This way, you can ensure that the `email` is unique regardless of the case.

Drizzle has simple and flexible API, which lets you easily create such an index using SQL-like syntax:
<CodeTabs items={["schema.ts", "migration.sql"]}>
  <CodeTab>
  ```ts copy {12,13}
  import { SQL, sql } from 'drizzle-orm';
  import { AnyPgColumn, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';

  export const users = pgTable(
    'users',
    {
      id: serial('id').primaryKey(),
      name: text('name').notNull(),
      email: text('email').notNull(),
    },
    (table) => [
      // uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
      uniqueIndex('emailUniqueIndex').on(lower(table.email)),
    ],
  );

  // custom lower function
  export function lower(email: AnyPgColumn): SQL {
    return sql`lower(${email})`;
  }
  ```
  </CodeTab>
  ```sql
  CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL
  );
  --> statement-breakpoint
  CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "users" USING btree (lower("email"));
  ```
</CodeTabs>

This is how you can select user by `email` with `lower` function:

<Section>
```ts copy {10}
import { eq } from 'drizzle-orm';
import { lower, users } from './schema';

const db = drizzle(...);

const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

```sql
select * from "users" where lower(email) = 'john@email.com';
```
</Section>

### MySQL

In MySQL, the default collation setting for string comparison is case-insensitive, which means that when performing operations like searching or comparing strings in SQL queries, the case of the characters does not affect the results. However, because collation settings can vary and may be configured to be case-sensitive, we will explicitly ensure that the `email` is unique regardless of case by creating a unique index on the lowercased `email` column.

Drizzle has simple and flexible API, which lets you easily create such an index using SQL-like syntax:
<CodeTabs items={["schema.ts", "migration.sql"]}>
  <CodeTab>
  ```ts copy {12,13}
  import { SQL, sql } from 'drizzle-orm';
  import { AnyMySqlColumn, mysqlTable, serial, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

  export const users = mysqlTable(
    'users',
    {
      id: serial('id').primaryKey(),
      name: varchar('name', { length: 255 }).notNull(),
      email: varchar('email', { length: 255 }).notNull(),
    },
    (table) => [
      // uniqueIndex('emailUniqueIndex').on(sql`(lower(${table.email}))`),
      uniqueIndex('emailUniqueIndex').on(lower(table.email)),
    ]
  );

  // custom lower function
  export function lower(email: AnyMySqlColumn): SQL {
    return sql`(lower(${email}))`;
  }
  ```
  </CodeTab>
  ```sql
  CREATE TABLE `users` (
	  `id` serial AUTO_INCREMENT NOT NULL,
	  `name` varchar(255) NOT NULL,
	  `email` varchar(255) NOT NULL,
	  CONSTRAINT `users_id` PRIMARY KEY(`id`),
	  CONSTRAINT `emailUniqueIndex` UNIQUE((lower(`email`)))
  );
  ```
</CodeTabs>

<Callout type="warning">
Functional indexes are supported in MySQL starting from version `8.0.13`. For the correct syntax, the expression should be enclosed in parentheses, for example, `(lower(column))`.
</Callout>

This is how you can select user by `email` with `lower` function:

<Section>
```ts copy {10}
import { eq } from 'drizzle-orm';
import { lower, users } from './schema';

const db = drizzle(...);

const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

```sql
select * from `users` where lower(email) = 'john@email.com';
```
</Section>

### SQLite

To implement a unique and case-insensitive `email` handling in SQLite with Drizzle, you can create a unique index on the lowercased `email` column. This way, you can ensure that the `email` is unique regardless of the case.

Drizzle has simple and flexible API, which lets you easily create such an index using SQL-like syntax:

<CodeTabs items={["schema.ts", "migration.sql"]}>
  <CodeTab>
  ```ts copy {12,13}
  import { SQL, sql } from 'drizzle-orm';
  import { AnySQLiteColumn, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

  export const users = sqliteTable(
    'users',
    {
      id: integer('id').primaryKey(),
      name: text('name').notNull(),
      email: text('email').notNull(),
    },
    (table) => [
      // uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
      uniqueIndex('emailUniqueIndex').on(lower(table.email)),
    ]
  );

  // custom lower function
  export function lower(email: AnySQLiteColumn): SQL {
    return sql`lower(${email})`;
  }
  ```
  </CodeTab>
  ```sql
  CREATE TABLE `users` (
	  `id` integer PRIMARY KEY NOT NULL,
	  `name` text NOT NULL,
	  `email` text NOT NULL
  );
  --> statement-breakpoint
  CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower(`email`));
  ```
</CodeTabs>

This is how you can select user by `email` with `lower` function:

<Section>
```ts copy {10}
import { eq } from 'drizzle-orm';
import { lower, users } from './schema';

const db = drizzle(...);

const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

```sql
select * from "users" where lower(email) = 'john@email.com';
```
</Section>


Source: https://orm.drizzle.team/docs/update-many-with-different-value


import Section from "@mdx/Section.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import IsSupportedChipGroup from "@mdx/IsSupportedChipGroup.astro";

<IsSupportedChipGroup chips={{PostgreSQL: true, MySQL: true, SQLite: true}}/>

<Prerequisites>
- Get started with [PostgreSQL](/docs/get-started-postgresql), [MySQL](/docs/get-started-mysql) and [SQLite](/docs/get-started-sqlite)
- [Update statement](/docs/update)
- [Filters](/docs/operators) and [sql operator](/docs/sql)
</Prerequisites>

To implement update many with different values for each row within 1 request you can use `sql` operator with `case` statement and `.update().set()` methods like this:

<Section>
```ts {26, 29, 32, 36, 38, 40}
import { SQL, inArray, sql } from 'drizzle-orm';
import { users } from './schema';

const db = drizzle(...);

const inputs = [
  {
    id: 1,
    city: 'New York',
  },
  {
    id: 2,
    city: 'Los Angeles',
  },
  {
    id: 3,
    city: 'Chicago',
  },
];

// You have to be sure that inputs array is not empty
if (inputs.length === 0) {
  return;
}

const sqlChunks: SQL[] = [];
const ids: number[] = [];

sqlChunks.push(sql`(case`);

for (const input of inputs) {
  sqlChunks.push(sql`when ${users.id} = ${input.id} then ${input.city}`);
  ids.push(input.id);
}

sqlChunks.push(sql`end)`);

const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));

await db.update(users).set({ city: finalSql }).where(inArray(users.id, ids));
```

```sql
update users set "city" = 
  (case when id = 1 then 'New York' when id = 2 then 'Los Angeles' when id = 3 then 'Chicago' end)
where id in (1, 2, 3)
```
</Section>


Source: https://orm.drizzle.team/docs/upsert


import Section from "@mdx/Section.astro";
import IsSupportedChipGroup from "@mdx/IsSupportedChipGroup.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';

<IsSupportedChipGroup chips={{PostgreSQL: true, MySQL: true, SQLite: true}}/>

<Prerequisites>
- Get started with [PostgreSQL](/docs/get-started-postgresql), [MySQL](/docs/get-started-mysql) and [SQLite](/docs/get-started-sqlite)
- [Insert statement](/docs/insert), [onConflictDoUpdate method](/docs/insert#on-conflict-do-update) and [onDuplicateKeyUpdate method](/docs/insert#on-duplicate-key-update)
- [Composite primary key](/docs/indexes-constraints#composite-primary-key)
- [sql operator](/docs/sql)
</Prerequisites>

### PostgreSQL and SQLite

To implement an upsert query in PostgreSQL and SQLite (skip to [MySQL](/docs/guides/upsert#mysql)) with Drizzle you can use `.onConflictDoUpdate()` method:

<Section>
```ts copy {8,9,10,11}
import { users } from './schema';

const db = drizzle(...);

await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'Super John' },
  });
```

```sql
insert into users ("id", "name") values (1, 'John')
  on conflict ("id") do update set name = 'Super John';
```
</Section>

To upsert multiple rows in one query in PostgreSQL and SQLite you can use `sql operator` and `excluded` keyword. `excluded` is a special reference that refer to the row that was proposed for insertion, but wasn't inserted because of the conflict.

This is how you can do it:

<CodeTabs items={["index.ts", "schema.ts"]}>
  <CodeTab>
    ```ts copy {21,24}
    import { sql } from 'drizzle-orm';
    import { users } from './schema';

    const values = [
      {
        id: 1,
        lastLogin: new Date(),
      },
      {
        id: 2,
        lastLogin: new Date(Date.now() + 1000 * 60 * 60),
      },
      {
        id: 3,
        lastLogin: new Date(Date.now() + 1000 * 60 * 120),
      },
    ];

    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.id,
        set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
      });
    ```

    ```sql
    insert into users ("id", "last_login") 
      values 
        (1, '2024-03-15T22:29:06.679Z'),
        (2, '2024-03-15T23:29:06.679Z'),
        (3, '2024-03-16T00:29:06.679Z')
      on conflict ("id") do update set last_login = excluded.last_login;
    ```
  </CodeTab>
  ```ts copy
  import { pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    lastLogin: timestamp('last_login', { mode: 'date' }).notNull(),
  });
  ```
</CodeTabs>

Drizzle has simple and flexible API, which lets you easily create custom solutions. This is how you do custom function for updating specific columns in multiple rows due to the conflict in PostgreSQL and SQLite:

<CodeTabs items={["index.ts", "schema.ts"]}>
  <CodeTab>
    ```ts copy {43,46}
    import { SQL, getTableColumns, sql } from 'drizzle-orm';
    import { PgTable } from 'drizzle-orm/pg-core';
    import { SQLiteTable } from 'drizzle-orm/sqlite-core';
    import { users } from './schema';

    const buildConflictUpdateColumns = <
      T extends PgTable | SQLiteTable,
      Q extends keyof T['_']['columns']
    >(
      table: T,
      columns: Q[],
    ) => {
      const cls = getTableColumns(table);

      return columns.reduce((acc, column) => {
        const colName = cls[column].name;
        acc[column] = sql.raw(`excluded.${colName}`);

        return acc;
      }, {} as Record<Q, SQL>);
    };

    const values = [
      {
        id: 1,
        lastLogin: new Date(),
        active: true,
      },
      {
        id: 2,
        lastLogin: new Date(Date.now() + 1000 * 60 * 60),
        active: true,
      },
      {
        id: 3,
        lastLogin: new Date(Date.now() + 1000 * 60 * 120),
        active: true,
      },
    ];

    await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.id,
        set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
      });
    ```

    ```sql
    insert into users ("id", "last_login", "active")
    values
      (1, '2024-03-16T15:44:41.141Z', true),
      (2, '2024-03-16T16:44:41.141Z', true),
      (3, '2024-03-16T17:44:41.141Z', true)
    on conflict ("id") do update set last_login = excluded.last_login, active = excluded.active;
    ```
  </CodeTab>
  ```ts copy
  import { boolean, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    lastLogin: timestamp('last_login', { mode: 'date' }).notNull(),
    active: boolean('active').notNull().default(false),
  });
  ```
</CodeTabs>

This is how you can implement an upsert query with multiple targets in PostgreSQL and SQLite:

<Section>
```ts copy {8}
import { sql } from 'drizzle-orm';
import { inventory } from './schema';

await db
  .insert(inventory)
  .values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({
    target: [inventory.warehouseId, inventory.productId], // composite primary key
    set: { quantity: sql`${inventory.quantity} + 100` }, // add 100 to the existing quantity
  });
```

```sql
insert into inventory ("warehouse_id", "product_id", "quantity") values (1, 1, 100)
  on conflict ("warehouse_id","product_id") do update set quantity = quantity + 100;
```
</Section>

If you want to implement upsert query with `where` clause for `update` statement, you can use `setWhere` property in `onConflictDoUpdate` method:

<CodeTabs items={["index.ts", "schema.ts"]}>
  <CodeTab>
  ```ts copy {25,26,27,28}
  import { or, sql } from 'drizzle-orm';
  import { products } from './schema';

  const data = {
    id: 1,
    title: 'Phone',
    price: '999.99',
    stock: 10,
    lastUpdated: new Date(),
  };

  const excludedPrice = sql.raw(`excluded.${products.price.name}`);
  const excludedStock = sql.raw(`excluded.${products.stock.name}`);

  await db
    .insert(products)
    .values(data)
    .onConflictDoUpdate({
      target: products.id,
      set: {
        price: excludedPrice,
        stock: excludedStock,
        lastUpdated: sql.raw(`excluded.${products.lastUpdated.name}`)
      },
      setWhere: or(
        sql`${products.stock} != ${excludedStock}`,
        sql`${products.price} != ${excludedPrice}`
      ),
    });
  ```

  ```sql
  insert into products ("id", "title", "stock", "price", "last_updated")
    values (1, 'Phone', 10, '999.99', '2024-04-29T21:56:55.563Z')
    on conflict ("id") do update
    set stock = excluded.stock, price = excluded.price, last_updated = excluded.last_updated
    where (stock != excluded.stock or price != excluded.price);
  ```
  </CodeTab>

  ```ts copy
  import { integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

  export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    stock: integer('stock').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  });
  ```
</CodeTabs>


If you want to update all columns except of specific one, you can leave the previous value like this:

<Section>
```ts copy {16}
import { sql } from 'drizzle-orm';
import { users } from './schema';

const data = {
  id: 1,
  name: 'John',
  email: 'john@email.com',
  age: 29,
};

await db
  .insert(users)
  .values(data)
  .onConflictDoUpdate({
    target: users.id,
    set: { ...data, email: sql`${users.email}` }, // leave email as it was
});
```

```sql
insert into users ("id", "name", "email", "age") values (1, 'John', 'john@email.com', 29)
  on conflict ("id") do update set id = 1, name = 'John', email = email, age = 29;
```
</Section>

### MySQL

To implement an upsert query in MySQL with Drizzle you can use `.onDuplicateKeyUpdate()` method. MySQL will automatically determine the conflict target based on the primary key and unique indexes, and will update the row if any unique index conflicts.

This is how you can do it:

<Section>
```ts copy {4}
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'Super John' } });
```

```sql
insert into users (`id`, `first_name`) values (1, 'John')
  on duplicate key update first_name = 'Super John';
```
</Section>

To upsert multiple rows in one query in MySQL you can use `sql operator` and `values()` function. `values()` function refers to the value of column that would be inserted if duplicate-key conflict hadn't occurred.  

<CodeTabs items={["index.ts", "schema.ts"]}>
  <CodeTab>
    ```ts copy {21,24}
    import { sql } from 'drizzle-orm';
    import { users } from './schema';

    const values = [
      {
        id: 1,
        lastLogin: new Date(),
      },
      {
        id: 2,
        lastLogin: new Date(Date.now() + 1000 * 60 * 60),
      },
      {
        id: 3,
        lastLogin: new Date(Date.now() + 1000 * 60 * 120),
      },
    ];

    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({
        set: {
          lastLogin: sql`values(${users.lastLogin})`,
        },
      });
    ```

    ```sql
    insert into users (`id`, `last_login`)
      values
        (1, '2024-03-15 23:08:27.025'),
        (2, '2024-03-15 00:08:27.025'),
        (3, '2024-03-15 01:08:27.025')
      on duplicate key update last_login = values(last_login);
    ```
  </CodeTab>
  ```ts copy
  import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

  export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    lastLogin: timestamp('last_login', { mode: 'date' }).notNull(),
  });
  ```
</CodeTabs>

Drizzle has simple and flexible API, which lets you easily create custom solutions. This is how you do custom function for updating specific columns in multiple rows due to the conflict in MySQL:

<CodeTabs items={["index.ts", "schema.ts"]}>
  <CodeTab>
    ```ts copy {36,38}
    import { SQL, getTableColumns, sql } from 'drizzle-orm';
    import { MySqlTable } from 'drizzle-orm/mysql-core';
    import { users } from './schema';

    const buildConflictUpdateColumns = <T extends MySqlTable, Q extends keyof T['_']['columns']>(
      table: T,
      columns: Q[],
    ) => {
      const cls = getTableColumns(table);
      return columns.reduce((acc, column) => {
        acc[column] = sql`values(${cls[column]})`;
        return acc;
      }, {} as Record<Q, SQL>);
    };

    const values = [
      {
        id: 1,
        lastLogin: new Date(),
        active: true,
      },
      {
        id: 2,
        lastLogin: new Date(Date.now() + 1000 * 60 * 60),
        active: true,
      },
      {
        id: 3,
        lastLogin: new Date(Date.now() + 1000 * 60 * 120),
        active: true,
      },
    ];

    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({
        set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
      });
    ```

    ```sql
    insert into users (`id`, `last_login`, `active`)
      values
        (1, '2024-03-16 15:23:28.013', true),
        (2, '2024-03-16 16:23:28.013', true),
        (3, '2024-03-16 17:23:28.013', true)
      on duplicate key update last_login = values(last_login), active = values(active);
    ```
  </CodeTab>
  ```ts copy
  import { boolean, mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

  export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    lastLogin: timestamp('last_login', { mode: 'date' }).notNull(),
    active: boolean('active').notNull().default(false),
  });
  ```
</CodeTabs>

If you want to update all columns except of specific one, you can leave the previous value like this:

<Section>
```ts copy {15}
import { sql } from 'drizzle-orm';
import { users } from './schema';

const data = {
  id: 1,
  name: 'John',
  email: 'john@email.com',
  age: 29,
};

await db
  .insert(users)
  .values(data)
  .onDuplicateKeyUpdate({
    set: { ...data, email: sql`${users.email}` }, // leave email as it was
});
```

```sql
insert into users (`id`, `name`, `email`, `age`) values (1, 'John', 'john@email.com', 29)
  on duplicate key update id = 1, name = 'John', email = email, age = 29;
```
</Section>


Source: https://orm.drizzle.team/docs/vector-similarity-search


import Section from "@mdx/Section.astro";
import IsSupportedChipGroup from "@mdx/IsSupportedChipGroup.astro";
import Prerequisites from "@mdx/Prerequisites.astro";
import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';
import Npm from "@mdx/Npm.astro";

<Prerequisites>
- Get started with [PostgreSQL](/docs/get-started-postgresql)
- [Select statement](/docs/select)
- [Indexes](/docs/indexes-constraints#indexes)
- [sql operator](/docs/sql)
- [pgvector extension](/docs/extensions/pg#pg_vector)
- [Drizzle kit](/docs/kit-overview)
- You should have installed the `openai` [package](https://www.npmjs.com/package/openai) for generating embeddings. 
<Npm>
  openai
</Npm>
- You should have `drizzle-orm@0.31.0` and `drizzle-kit@0.22.0` or higher.  
</Prerequisites>

To implement vector similarity search in PostgreSQL with Drizzle ORM, you can use the `pgvector` extension. This extension provides a set of functions to work with vectors and perform similarity search.

As for now, Drizzle doesn't create extension automatically, so you need to create it manually. Create an empty migration file and add SQL query:

<Section>
```bash
npx drizzle-kit generate --custom
```

```sql
CREATE EXTENSION vector;
```
</Section>

To perform similarity search, you need to create a table with a vector column and an `HNSW` or `IVFFlat` index on this column for better performance:

<CodeTabs items={["schema.ts", "migration.sql"]}>
  <CodeTab>
  ```ts copy {10, 13}
  import { index, pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

  export const guides = pgTable(
    'guides',
    {
      id: serial('id').primaryKey(),
      title: text('title').notNull(),
      description: text('description').notNull(),
      url: text('url').notNull(),
      embedding: vector('embedding', { dimensions: 1536 }),
    },
    (table) => [
      index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
    ]
  );
  ```
  </CodeTab>
  ```sql
  CREATE TABLE IF NOT EXISTS "guides" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "url" text NOT NULL,
    "embedding" vector(1536)
  );
  --> statement-breakpoint
  CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "guides" USING hnsw (embedding vector_cosine_ops);
  ```
</CodeTabs>

The `embedding` column is used to store vector embeddings of the guide descriptions. Vector embedding is just a representation of some data. It converts different types of data into a common format (vectors) that language models can process. This allows us to perform mathematical operations, such as measuring the distance between two vectors, to determine how similar or different two data items are.

In this example we will use `OpenAI` model to generate [embeddings](https://platform.openai.com/docs/guides/embeddings) for the description:
```ts copy
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');

  const { data } = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  });

  return data[0].embedding;
};
```

To search for similar guides by embedding, you can use `gt` and `sql` operators with `cosineDistance` function to calculate the similarity between the `embedding` column and the generated embedding:

<Section>
```ts copy {10,15,16}
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { generateEmbedding } from './embedding';
import { guides } from './schema';

const db = drizzle(...);

const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);

  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;

  const similarGuides = await db
    .select({ name: guides.title, url: guides.url, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  return similarGuides;
};
```

```ts
const description = 'Guides on using Drizzle ORM with different platforms';

const similarGuides = await findSimilarGuides(description);
```

```json
[
  {
    name: 'Drizzle with Turso',
    url: '/docs/tutorials/drizzle-with-turso',
    similarity: 0.8642314333984994
  },
  {
    name: 'Drizzle with Supabase Database',
    url: '/docs/tutorials/drizzle-with-supabase',
    similarity: 0.8593631126014918
  },
  {
    name: 'Drizzle with Neon Postgres',
    url: '/docs/tutorials/drizzle-with-neon',
    similarity: 0.8541051184461372
  },
  {
    name: 'Drizzle with Vercel Edge Functions',
    url: '/docs/tutorials/drizzle-with-vercel-edge-functions',
    similarity: 0.8481551084241092
  }
]
```
</Section>


Source: https://orm.drizzle.team/docs/indexes-constraints

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Callout from '@mdx/Callout.astro';
import Section from '@mdx/Section.astro';

