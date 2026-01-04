## Quick start

Make sure your `drizzle-orm` version is at least `0.30.9`, and update if needed:
<Npm>drizzle-orm@latest</Npm>

### Apollo Server

<Npm>drizzle-graphql @apollo/server graphql</Npm>

<CodeTabs items={['server.ts', 'schema.ts']}>
<CodeTab>
```ts copy {1, 10}
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import client from './db';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import * as dbSchema from './schema';

const db = drizzle({ client, schema: dbSchema });

const { schema } = buildSchema(db);

const server = new ApolloServer({ schema });
const { url } = await startStandaloneServer(server);

console.log(`🚀 Server ready at ${url}`);
```
</CodeTab>
<CodeTab>
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
</CodeTab>
</CodeTabs>

### GraphQL Yoga

<Npm>drizzle-graphql graphql-yoga graphql</Npm>

<CodeTabs items={['server.ts', 'schema.ts']}>
<CodeTab>
```ts copy {1, 10}
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

import * as dbSchema from './schema';

const db = drizzle({ schema: dbSchema });

const { schema } = buildSchema(db);

const yoga = createYoga({ schema });
const server = createServer(yoga);

server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql');
});
```
</CodeTab>
<CodeTab>
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
</CodeTab>
</CodeTabs>

