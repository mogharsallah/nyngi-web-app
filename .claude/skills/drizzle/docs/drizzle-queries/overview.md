# Drizzle Queries

<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'SQLite': true, 'MySQL': true, 'SingleStore': true }} />

Drizzle ORM is designed to be a thin typed layer on top of SQL. 
We truly believe we've designed the best way to operate an SQL database from TypeScript and it's time to make it better.  
  
Relational queries are meant to provide you with a great developer experience for querying 
nested relational data from an SQL database, avoiding multiple joins and complex data mappings.  

It is an extension to the existing schema definition and query builder. 
You can opt-in to use it based on your needs. 
We've made sure you have both the best-in-class developer experience and performance.  

<CodeTabs items={["index.ts", "schema.ts"]}>
	<CodeTab>
	```typescript copy /schema/3
	import * as schema from './schema';
	import { drizzle } from 'drizzle-orm/...';

	const db = drizzle({ schema });

	const result = await db._query.users.findMany({
		with: {
			posts: true			
		},
	});
	```

	```ts
	[{
		id: 10,
		name: "Dan",
		posts: [
			{
				id: 1,
				content: "SQL is awesome",
				authorId: 10,
			},
			{
				id: 2,
				content: "But check relational queries",
				authorId: 10,
			}
		]
	}]
	```
	</CodeTab>

	```typescript copy
	import { integer, serial, text, pgTable } from 'drizzle-orm/pg-core';
	import { relations } from 'drizzle-orm';

	export const users = pgTable('users', {
		id: serial('id').primaryKey(),
		name: text('name').notNull(),
	});

	export const usersRelations = relations(users, ({ many }) => ({
		posts: many(posts),
	}));

	export const posts = pgTable('posts', {
		id: serial('id').primaryKey(),
		content: text('content').notNull(),
		authorId: integer('author_id').notNull(),
	});

	export const postsRelations = relations(posts, ({ one }) => ({
		author: one(users, { fields: [posts.authorId], references: [users.id] }),
	}));
	```
</CodeTabs>

⚠️ If you have SQL schema declared in multiple files you can do it like that
<CodeTabs items={["index.ts", "schema1.ts", "schema2.ts"]}>
	```typescript copy /schema/3
	import * as schema1 from './schema1';
	import * as schema2 from './schema2';
	import { drizzle } from 'drizzle-orm/...';

	const db = drizzle({ schema: { ...schema1, ...schema2 } });

	const result = await db._query.users.findMany({
		with: {
			posts: true			
		},
	});
	```
	
	```ts
	// schema declaration in the first file
	```
	```ts
	// schema declaration in the second file
	```
</CodeTabs>


