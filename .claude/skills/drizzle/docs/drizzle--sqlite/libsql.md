## libsql
#### Step 1 - Install packages
<Npm>
drizzle-orm @libsql/client
-D drizzle-kit
</Npm>

#### Step 2 - Initialize the driver
Drizzle has native support for all @libsql/client driver variations:

<LibsqlTable />
<br/>
<LibsqlTabs />

#### Step 3 - make a query
<CodeTabs items={["libsql", "libsql with config"]}>
```typescript copy
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle(process.env.DATABASE_URL);
 
const result = await db.execute('select 1');
```
```typescript copy
import { drizzle } from 'drizzle-orm/libsql';

// You can specify any property from the libsql connection options
const db = drizzle({ connection: { url:'', authToken: '' }});
 
const result = await db.execute('select 1');
```
</CodeTabs>

If you need a synchronous connection, you can use our additional connection API, 
where you specify a driver connection and pass it to the Drizzle instance.

```typescript copy
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client);

const result = await db.execute('select 1');
```

