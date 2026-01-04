## Roles

Currently, Drizzle supports defining roles with a few different options, as shown below. Support for more options will be added in a future release.

```ts
import { pgRole } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin', { createRole: true, createDb: true, inherit: true });
```

If a role already exists in your database, and you don’t want drizzle-kit to ‘see’ it or include it in migrations, you can mark the role as existing.

```ts
import { pgRole } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin').existing();
```

