## `with update` clause

<Callout>
  Check how to use WITH statement with [select](/docs/select#with-clause), [insert](/docs/insert#with-insert-clause), [delete](/docs/delete#with-delete-clause)
</Callout>

Using the `with` clause can help you simplify complex queries by splitting them into smaller subqueries called common table expressions (CTEs):
<Section>
```typescript copy
const averagePrice = db.$with('average_price').as(
        db.select({ value: sql`avg(${products.price})`.as('value') }).from(products)
);

const result = await db.with(averagePrice)
		.update(products)
		.set({
			cheap: true
		})
		.where(lt(products.price, sql`(select * from ${averagePrice})`))
		.returning({
			id: products.id
		});
```
```sql
with "average_price" as (select avg("price") as "value" from "products") 
update "products" set "cheap" = $1 
where "products"."price" < (select * from "average_price") 
returning "id"
```
</Section>

