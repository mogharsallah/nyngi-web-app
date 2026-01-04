# Drizzle relations

<Callout type='error'>
This page explains concepts available on drizzle versions `1.0.0-beta.1` and higher.
</Callout>

<Npm>
drizzle-orm@beta
drizzle-kit@beta -D
</Npm>

<br/>

<Prerequisites>  
  - **Relations Fundamentals** - get familiar with the concepts of foreign key constraints, soft relations, database normalization, etc - [read here](/docs/rqb-fundamentals)
  - **Declare schema** - get familiar with how to define drizzle schemas - [read here](/docs/sql-schema-declaration)
  - **Database connection** - get familiar with how to connect to database using drizzle - [read here](/docs/get-started-postgresql)
</Prerequisites>

The sole purpose of Drizzle relations is to let you query your relational data in the most simple and concise way:

<CodeTabs items={["Relational queries", "Select with joins"]}>
<Section>
```ts
import { drizzle } from 'drizzle-orm/…';
import { defineRelations } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';

export const users = p.pgTable('users', {
	id: p.integer().primaryKey(),
	name: p.text().notNull()
});

export const posts = p.pgTable('posts', {
	id: p.integer().primaryKey(),
	content: p.text().notNull(),
	ownerId: p.integer('owner_id'),
});

const relations = defineRelations({ users, posts }, (r) => ({
	posts: {
		author: r.one.users({
			from: r.posts.ownerId,
			to: r.users.id,
		}),
	}
}))

const db = drizzle(client, { relations });

const result = db.query.posts.findMany({
  with: {
    author: true,
  },
});
```
```ts
[{
  id: 10,
  content: "My first post!",
  author: {
    id: 1,
    name: "Alex"
  }
}]
```
</Section>
<Section>
```ts
import { drizzle } from 'drizzle-orm/…';
import { eq } from 'drizzle-orm';
import { posts, users } from './schema';

const db = drizzle(client);

const res = await db.select()
                    .from(posts)
                    .leftJoin(users, eq(posts.ownerId, users.id))
                    .orderBy(posts.id)
const mappedResult =  
```
</Section>
</CodeTabs>

### `one()`
Here is a list of all fields available for `.one()` in drizzle relations

```ts {3-11}
const relations = defineRelations({ users, posts }, (r) => ({
	posts: {
		author: r.one.users({
			from: r.posts.ownerId,
			to: r.users.id,
			optional: false,
      alias: 'custom_name',
			where: {
				verified: true,
			}
		}),
	}
}))
```

- `author` key is a custom key that appears in the `posts` object when using Drizzle relational queries.
- `r.one.users` defines that `author` will be a single object from the `users` table rather than an array of objects.
- `from: r.posts.ownerId` specifies the table from which we are establishing a soft relation. 
In this case, the relation starts from the `ownerId` column in the `posts` table.
- `to: r.users.id` specifies the table to which we are establishing a soft relation. 
In this case, the relation points to the `id` column in the `users` table.
- `optional: false` at the type level makes the `author` key in the posts object `required`. 
This should be used when you are certain that this specific entity will always exist.
- `alias` is used to add a specific alias to relationships between tables. If you have multiple identical relationships between two tables, you should 
differentiate them using `alias`
- `where` condition can be used for polymorphic relations. It fetches relations based on a `where` statement.
For example, in the case above, only `verified authors` will be retrieved. Learn more about polymorphic relations [here](/docs/relations-schema-declaration#polymorphic-relations).

### `many()`

Here is a list of all fields available for `.many()` in drizzle relations

```ts {3-11}
const relations = defineRelations({ users, posts }, (r) => ({
	users: {
		feed: r.many.posts({
			from: r.users.id,
			to: r.posts.ownerId,
			optional: false,
      alias: 'custom_name',
			where: {
				approved: true,
			}
		}),
	}
}))
```

- `feed` key is a custom key that appears in the `users` object when using Drizzle relational queries.
- `r.many.posts` defines that `feed` will be an array of objects from the `posts` table rather than just an object
- `from: r.users.id` specifies the table from which we are establishing a soft relation. 
In this case, the relation starts from the `id` column in the `users` table.
- `to: r.posts.ownerId` specifies the table to which we are establishing a soft relation. 
In this case, the relation points to the `ownerId` column in the `posts` table.
- `optional: false` at the type level makes the `feed` key in the posts object `required`. 
This should be used when you are certain that this specific entity will always exist.
- `alias` is used to add a specific alias to relationships between tables. If you have multiple identical relationships between two tables, you should 
differentiate them using `alias`
- `where` condition can be used for polymorphic relations. It fetches relations based on a `where` statement.
For example, in the case above, only `approved posts` will be retrieved. Learn more about polymorphic relations [here](/docs/relations-schema-declaration#polymorphic-relations).

