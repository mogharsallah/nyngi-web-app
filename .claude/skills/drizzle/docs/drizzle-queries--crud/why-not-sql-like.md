## Why not SQL-like?

We're always striving for a perfectly balanced solution. While SQL-like queries cover 100% of your needs, 
there are certain common scenarios where data can be queried more efficiently.

We've built the Queries API so you can fetch relational, nested data from the database in the most convenient 
and performant way, without worrying about joins or data mapping.

**Drizzle always outputs exactly one SQL query**. Feel free to use it with serverless databases,
and never worry about performance or roundtrip costs!

<Section>
```ts
const result = await db.query.users.findMany({
	with: {
		posts: true
	},
});
```
{/* ```sql
SELECT * FROM users ...
``` */}
</Section>

