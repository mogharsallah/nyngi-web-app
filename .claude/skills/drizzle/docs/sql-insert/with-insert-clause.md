## `with insert` clause

<Callout>
  Check how to use WITH statement with [select](/docs/select#with-clause), [update](/docs/update#with-update-clause), [delete](/docs/delete#with-delete-clause)
</Callout>

Using the `with` clause can help you simplify complex queries by splitting them into smaller subqueries called common table expressions (CTEs):
<Section>
```typescript copy
const userCount = db.$with('user_count').as(
	db.select({ value: sql`count(*)`.as('value') }).from(users)
);

const result = await db.with(userCount)
	.insert(users)
	.values([
		{ username: 'user1', admin: sql`((select * from ${userCount}) = 0)` }
	])
	.returning({
		admin: users.admin
	});
```
```sql
with "user_count" as (select count(*) as "value" from "users") 
insert into "users" ("username", "admin") 
values ($1, ((select * from "user_count") = 0)) 
returning "admin"
```
</Section>


