## Why SQL-like?
\
**If you know SQL, you know Drizzle.**

Other ORMs and data frameworks tend to deviate from or abstract away SQL, leading to a double learning curve: you need to learn both SQL and the framework's API.

Drizzle is the opposite.
We embrace SQL and built Drizzle to be SQL-like at its core, so you have little to no learning curve and full access to the power of SQL.

<Section>
```typescript copy
// Access your data
await db
  .select()
	.from(posts)
	.leftJoin(comments, eq(posts.id, comments.post_id))
	.where(eq(posts.id, 10))
```
```sql
SELECT * 
FROM posts
LEFT JOIN comments ON posts.id = comments.post_id
WHERE posts.id = 10
```
</Section>

With SQL-like syntax, you can replicate much of what you can do with pure SQL and know 
exactly what Drizzle will do and what query will be generated. You can perform a wide range of queries, 
including select, insert, update, delete, as well as using aliases, WITH clauses, subqueries, prepared statements, 
and more. Let's look at more examples

<CodeTabs items={['insert', 'update', 'delete']}>
<Section>
```ts
await db.insert(users).values({ email: 'user@gmail.com' })
```
```sql
INSERT INTO users (email) VALUES ('user@gmail.com')
```
</Section>
<Section>
```ts
await db.update(users)
        .set({ email: 'user@gmail.com' })
        .where(eq(users.id, 1))
```
```sql
UPDATE users 
SET email = 'user@gmail.com'
WHERE users.id = 1
```
</Section>
<Section>
```ts
await db.delete(users).where(eq(users.id, 1))
```
```sql
DELETE FROM users WHERE users.id = 1
```
</Section>
</CodeTabs>

