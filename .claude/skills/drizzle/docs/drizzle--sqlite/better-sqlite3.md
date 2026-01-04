## better-sqlite3
#### Step 1 - Install packages
<Npm>
drizzle-orm better-sqlite3
-D drizzle-kit @types/better-sqlite3
</Npm>

#### Step 2 - Initialize the driver and make a query
<CodeTabs items={["better-sqlite3", "better-sqlite3 with config"]}>
```typescript copy
import { drizzle } from 'drizzle-orm/better-sqlite3';

const db = drizzle(process.env.DATABASE_URL);

const result = await db.execute('select 1');
```
```typescript copy
import { drizzle } from 'drizzle-orm/better-sqlite3';

// You can specify any property from the better-sqlite3 connection options
const db =  drizzle({ connection: { source: process.env.DATABASE_URL }});

const result = await db.execute('select 1');
```
</CodeTabs>

If you need to provide your existing driver:
```typescript copy
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });

const result = await db.execute('select 1');
```

#### What's next?

<WhatsNextPostgres/>


Source: https://orm.drizzle.team/docs/get-started

import Callout from '@mdx/Callout.astro';
import CodeTabs from '@mdx/CodeTabs.astro';
import YoutubeCards from '@mdx/YoutubeCards.astro';
import GetStartedLinks from '@mdx/GetStartedLinks/index.astro';

