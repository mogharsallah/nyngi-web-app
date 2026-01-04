## Why not SQL-like?
We're always striving for a perfectly balanced solution, and while SQL-like does cover 100% of the needs, 
there are certain common scenarios where you can query data in a better way.  

We've built the **[Queries API](/docs/rqb)** for you, so you can fetch relational nested data from the database 
in the most convenient and performant way, and never think about joins and data mapping.  

**Drizzle always outputs exactly 1 SQL query.** Feel free to use it with serverless databases and never worry about performance or roundtrip costs!

```ts
const result = await db.query.users.findMany({
	with: {
		posts: true
	},
});
```

