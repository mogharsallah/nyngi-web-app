## Limitations

#### Types limitations for `with`

Due to certain TypeScript limitations and the current API in Drizzle, it is not possible to properly infer references between tables, especially when circular dependencies between tables exist.

This means the `with` option will display all tables in the schema, and you will need to manually select the one that has a one-to-many relationship

<Callout title='warning'>
The `with` option works for one-to-many relationships. For example, if you have one `user` and many `posts`, you can use users `with` posts, but you cannot use posts `with` users
</Callout>

#### Type limitations for the third parameter in Drizzle tables:

Currently, we do not have type support for the third parameter in Drizzle tables. While it will work at runtime, it will not function correctly at the type level


Source: https://orm.drizzle.team/docs/seed-versioning

import Tab from "@mdx/Tab.astro";
import Tabs from "@mdx/Tabs.astro";
import Callout from "@mdx/Callout.astro";
import TableWrapper from "@mdx/TableWrapper.astro";

