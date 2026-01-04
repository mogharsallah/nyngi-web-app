## Compare objects types (instanceof alternative)

You can check if an object is of a specific Drizzle type using the `is()` function. 
You can use it with any available type in Drizzle.

<Callout type="warning" emoji="⭐️">
  You should always use `is()` instead of `instanceof`
</Callout>

**Few examples**
```ts
import { Column, is } from 'drizzle-orm';

if (is(value, Column)) {
  // value's type is narrowed to Column
}
```

### Mock Driver
This API is a successor to an undefined `drizzle({} as any)` API which we've used internally in Drizzle tests and rarely recommended to external developers. 

We decided to build and expose a proper API, every `drizzle` driver now has `drizzle.mock()`:
```ts
import { drizzle } from "drizzle-orm/...";

const db = drizzle.mock();
```

you can provide schema if necessary for types
```ts
import { drizzle } from "drizzle-orm/...";
import * as schema from "./schema"

const db = drizzle.mock({ schema });
```

Source: https://orm.drizzle.team/docs/gotchas

import CodeTab from "@mdx/CodeTab.astro";
import CodeTabs from "@mdx/CodeTabs.astro";
import Section from "@mdx/Section.astro";
import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";

