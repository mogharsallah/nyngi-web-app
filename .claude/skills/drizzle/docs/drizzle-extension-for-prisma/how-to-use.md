## How to use

<Steps>
#### Install dependencies

You need to install Drizzle itself and a generator package that will create Drizzle schema from the Prisma schema.
<Npm>
drizzle-orm@latest
-D drizzle-prisma-generator
</Npm>

#### Update your Prisma schema

Add Drizzle generator to your Prisma schema. `output` is the path where generated Drizzle schema TS files will be placed.
```prisma copy filename="schema.prisma" {5-8}
generator client {
  provider = "prisma-client-js"
}

generator drizzle {
  provider = "drizzle-prisma-generator"
  output   = "./drizzle" // Where to put generated Drizle tables
}

// Rest of your Prisma schema

datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}

...
```

#### Generate Drizzle schema

```bash
prisma generate
```

#### Add Drizzle extension to your Prisma client

<CodeTabs items={["PostgreSQL", "MySQL", "SQLite"]}>
<CodeTab>
```ts copy
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';

const prisma = new PrismaClient().$extends(drizzle());
```
</CodeTab>
<CodeTab>
```ts copy
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/mysql';

const prisma = new PrismaClient().$extends(drizzle());
```
</CodeTab>
<CodeTab>
```ts copy
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/sqlite';

const prisma = new PrismaClient().$extends(drizzle());
```
</CodeTab>
</CodeTabs>

#### Run Drizzle queries via `prisma.$drizzle` ✨

In order to use Drizzle query builder, you need references to Drizzle tables.
You can import them from the output path that you specified in the generator config.

```ts copy
import { User } from './drizzle';

await prisma.$drizzle.insert().into(User).values({ email: 'sorenbs@drizzle.team', name: 'Søren' });
const users = await prisma.$drizzle.select().from(User);
```

</Steps>

