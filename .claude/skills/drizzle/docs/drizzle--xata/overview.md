# Drizzle \<\> Xata

<Prerequisites>
- Database [connection basics](/docs/connect-overview) with Drizzle
- Drizzle PostgreSQL drivers - [docs](/docs/get-started-postgresql)
</Prerequisites>

**[Xata](https://xata.io)** is a PostgreSQL database platform designed to help developers operate and scale databases with enhanced productivity and performance. Xata provides features like instant copy-on-write database branches, zero-downtime schema changes, data anonymization, AI-powered performance monitoring, and BYOC. 

Checkout official **[Xata + Drizzle](https://xata.io/documentation/quickstarts/drizzle)** docs.

#### Step 1 - Install packages

<Npm>
drizzle-orm postgres
-D drizzle-kit
</Npm>

#### Step 2 - Initialize the driver and make a query

```typescript copy filename="index.ts"
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);

const allUsers = await db.select().from(...);
```

If you need to provide your existing driver:
```typescript copy filename="index.ts"
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });

const allUsers = await db.select().from(...);
```

#### What's next?

<WhatsNextPostgres/>

Source: https://orm.drizzle.team/docs/custom-types

import Tab from '@mdx/Tab.astro';
import Tabs from '@mdx/Tabs.astro';
import Callout from '@mdx/Callout.astro'

