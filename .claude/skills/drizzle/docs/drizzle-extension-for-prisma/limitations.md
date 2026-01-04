## Limitations

- [Relational queries](/docs/rqb) are not supported due to a [Prisma driver limitation](https://github.com/prisma/prisma/issues/17576). Because of it, Prisma is unable to return query results in array format, which is required for relational queries to work.
- In SQLite, `.values()` (e.g. `await db.select().from(table).values()`) is not supported, because of the same reason as above.
- [Prepared statements](/docs/perf-queries#prepared-statement) support is limited - `.prepare()` will only build the SQL query on Drizzle side, because there is no Prisma API for prepared queries.


Source: https://orm.drizzle.team/docs/query-utils

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Callout from '@mdx/Callout.astro';
import Section from '@mdx/Section.astro';
import IsSupportedChipGroup from '@mdx/IsSupportedChipGroup.astro';
import $count from '@mdx/$count.mdx';

