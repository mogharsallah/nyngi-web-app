## WITH DELETE clause

<Callout>
  Check how to use WITH statement with [select](/docs/select#with-clause), [insert](/docs/insert#with-insert-clause), [update](/docs/update#with-update-clause)
</Callout>

Using the `with` clause can help you simplify complex queries by splitting them into smaller subqueries called common table expressions (CTEs):
<Section>
```typescript copy
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders)
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({
		id: orders.id
	});
```
```sql
with "average_amount" as (select avg("amount") as "value" from "orders") 
delete from "orders" 
where "orders"."amount" > (select * from "average_amount") 
returning "id"
```
</Section>

Source: https://orm.drizzle.team/docs/drizzle-config-file

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import SchemaFilePaths from "@mdx/SchemaFilePaths.mdx"
import Prerequisites from "@mdx/Prerequisites.astro"
import Dialects from "@mdx/Dialects.mdx"
import Drivers from "@mdx/Drivers.mdx"
import DriversExamples from "@mdx/DriversExamples.mdx"
import Npx from "@mdx/Npx.astro"

