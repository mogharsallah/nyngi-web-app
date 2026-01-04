## Logging
To enable default query logging, just pass `{ logger: true }` to the `drizzle` initialization function:
```typescript copy
import { drizzle } from 'drizzle-orm/...'; // driver specific

const db = drizzle({ logger: true });
```

You can change the logs destination by creating a `DefaultLogger` instance and providing a custom `writer` to it:
```typescript copy
import { DefaultLogger, LogWriter } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/...'; // driver specific

class MyLogWriter implements LogWriter {
  write(message: string) {
    // Write to file, stdout, etc.
  }
}

const logger = new DefaultLogger({ writer: new MyLogWriter() });
const db = drizzle({ logger });
```

You can also create a custom logger:
```typescript copy
import { Logger } from 'drizzle-orm/logger';
import { drizzle } from 'drizzle-orm/...'; // driver specific

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

const db = drizzle({ logger: new MyLogger() });
```


