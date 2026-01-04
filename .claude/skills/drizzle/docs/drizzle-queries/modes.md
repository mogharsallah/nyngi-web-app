## Modes
Drizzle relational queries always generate exactly one SQL statement to run on the database and it has certain caveats. 
To have best in class support for every database out there we've introduced **`modes`**.  

Drizzle relational queries use lateral joins of subqueries under the hood and for now PlanetScale does not support them.

When using **mysql2** driver with regular **MySQL** database — you should specify `mode: "default"`
When using **mysql2** driver with **PlanetScale** — you need to specify `mode: "planetscale"`

```ts copy
import * as schema from './schema';
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  uri: process.env.PLANETSCALE_DATABASE_URL,
});

const db = drizzle({ client: connection, schema, mode: 'planetscale' });
```

