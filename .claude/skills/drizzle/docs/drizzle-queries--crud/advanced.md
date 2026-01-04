## Advanced
With Drizzle, queries can be composed and partitioned in any way you want. You can compose filters 
independently from the main query, separate subqueries or conditional statements, and much more. 
Let's check a few advanced examples:

#### Compose a WHERE statement and then use it in a query
```ts
async function getProductsBy({
  name,
  category,
  maxPrice,
}: {
  name?: string;
  category?: string;
  maxPrice?: string;
}) {
  const filters: SQL[] = [];

  if (name) filters.push(ilike(products.name, name));
  if (category) filters.push(eq(products.category, category));
  if (maxPrice) filters.push(lte(products.price, maxPrice));

  return db
    .select()
    .from(products)
    .where(and(...filters));
}
```

#### Separate subqueries into different variables, and then use them in the main query
```ts
const subquery = db
	.select()
	.from(internalStaff)
	.leftJoin(customUser, eq(internalStaff.userId, customUser.id))
	.as('internal_staff');

const mainQuery = await db
	.select()
	.from(ticket)
	.leftJoin(subquery, eq(subquery.internal_staff.userId, ticket.staffId));
```

#### What's next?
<br/>
<Flex>
  <LinksList 
    title='Access your data'
    links={[
        ["Query", "/docs/rqb"], 
        ["Select", "/docs/select"],
        ["Insert", "/docs/insert"],
        ["Update", "/docs/update"],
        ["Delete", "/docs/delete"],
        ["Filters", "/docs/operators"],
        ["Joins", "/docs/joins"],
        ["sql`` operator", "/docs/sql"],
      ]}
  />
  <LinksList 
    title='Zero to Hero'
    links={[
        ["Migrations", "/docs/migrations"], 
      ]}
  />
</Flex>


Source: https://orm.drizzle.team/docs/delete

import IsSupportedChipGroup from '@mdx/IsSupportedChipGroup.astro';
import Callout from '@mdx/Callout.astro';
import Section from '@mdx/Section.astro';

