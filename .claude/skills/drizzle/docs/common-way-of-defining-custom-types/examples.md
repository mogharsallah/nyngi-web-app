## Examples

The best way to see how `customType` definition is working is to check how existing data types
could be defined using `customType` function from Drizzle ORM.


<Callout title='info'>
Each dialect exposes `customType` function 

```ts
import { customType } from 'drizzle-orm/pg-core';
...
import { customType } from 'drizzle-orm/mysql-core';
...
import { customType } from 'drizzle-orm/sqlite-core';
...
import { customType } from 'drizzle-orm/gel-core';
...
import { customType } from 'drizzle-orm/singlestore-core';
```
</Callout>

**Integer**
```typescript copy
import { customType } from 'drizzle-orm/pg-core';

const customSerial = customType<{ data: number; }>(
  {
    dataType() {
      return 'integer';
    },
  },
);
```

**Text**

```typescript copy
import { customType } from 'drizzle-orm/pg-core';

const customText = customType<{ data: string }>({
  dataType() {
    return 'text';
  },
});
```

**Boolean**

```typescript copy
import { customType } from 'drizzle-orm/pg-core';

const customBoolean = customType<{ data: boolean }>({
  dataType() {
    return 'boolean';
  },
});
```

**Jsonb**

```typescript copy
import { customType } from 'drizzle-orm/pg-core';

const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return 'jsonb';
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
  })(name);
```

**Timestamp**

```typescript copy
import { customType } from 'drizzle-orm/pg-core';

const customTimestamp = customType<
  {
    data: Date;
    driverData: string;
    config: { withTimezone: boolean; precision?: number };
  }
>({
  dataType(config) {
    const precision = typeof config.precision !== 'undefined'
      ? ` (${config.precision})`
      : '';
    return `timestamp${precision}${
      config.withTimezone ? ' with time zone' : ''
    }`;
  },
  fromDriver(value: string): Date {
    return new Date(value);
  },
});
```

Usage for all types will be same as defined functions in Drizzle ORM. For example:

```typescript copy
const usersTable = pgTable('users', {
  id: customSerial('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJsonb<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { withTimezone: true }).notNull()
    .default(sql`now()`),
});
```



