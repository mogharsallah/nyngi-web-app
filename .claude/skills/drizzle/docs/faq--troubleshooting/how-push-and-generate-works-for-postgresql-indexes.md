## How `push` and `generate` works for PostgreSQL indexes

### Limitations

1. **You should specify a name for your index manually if you have an index on at least one expression**

Example

```ts
index().on(table.id, table.email) // will work well and name will be autogeneretaed
index('my_name').on(table.id, table.email) // will work well

// but

index().on(sql`lower(${table.email})`) // error
index('my_name').on(sql`lower(${table.email})`) // will work well
```

2. **Push won't generate statements if these fields(list below) were changed in an existing index:**

- expressions inside `.on()` and `.using()`
- `.where()` statements
- operator classes `.op()` on columns

If you are using `push` workflows and want to change these fields in the index, you would need to:

1. Comment out the index
2. Push
3. Uncomment the index and change those fields
4. Push again

For the `generate` command, `drizzle-kit` will be triggered by any changes in the index for any property in the new drizzle indexes API, so there are no limitations here.

Source: https://orm.drizzle.team/docs/generated-columns

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import CodeTabs from '@mdx/CodeTabs.astro';
import CodeTab from '@mdx/CodeTab.astro';
import Callout from '@mdx/Callout.astro';

