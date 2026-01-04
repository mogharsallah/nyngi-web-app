## Reset database

With `drizzle-seed`, you can easily reset your database and seed it with new values, for example, in your test suites

```ts
// path to a file with schema you want to reset
import * as schema from "./schema.ts";
import { reset } from "drizzle-seed";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await reset(db, schema);
}

main();
```

Different dialects will have different strategies for database resetting

<Tabs items={['PostgreSQL', 'MySQL', 'SQLite', 'SingleStore', 'CockroachDB', 'MS SQL']}>
<Tab>
For PostgreSQL, the `drizzle-seed` package will generate `TRUNCATE` statements with the `CASCADE` option to 
ensure that all tables are empty after running the reset function

```sql
TRUNCATE tableName1, tableName2, ... CASCADE;
```

</Tab>
<Tab>
For MySQL, the `drizzle-seed` package will first disable `FOREIGN_KEY_CHECKS` to ensure the next step won't fail, and then 
generate `TRUNCATE` statements to empty the content of all tables

```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE tableName1;
TRUNCATE tableName2;
...
SET FOREIGN_KEY_CHECKS = 1;
```

</Tab>
<Tab>
For SQLite, the `drizzle-seed` package will first disable the `foreign_keys` pragma to ensure the next step won't fail, 
and then generate `DELETE FROM` statements to empty the content of all tables

```sql
PRAGMA foreign_keys = OFF;
DELETE FROM tableName1;
DELETE FROM tableName2;
...
PRAGMA foreign_keys = ON;
```

</Tab>
<Tab>
For SingleStore, the `drizzle-seed` package will first disable `FOREIGN_KEY_CHECKS` to ensure the next step won't fail, and then 
generate `TRUNCATE` statements to empty the content of all tables

```sql
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE tableName1;
TRUNCATE tableName2;
...
SET FOREIGN_KEY_CHECKS = 1;
```

</Tab>
<Tab>
For CockroachDB, the `drizzle-seed` package will generate `TRUNCATE` statements with the `CASCADE` option to 
ensure that all tables are empty after running the reset function

```sql
TRUNCATE tableName1, tableName2, ... CASCADE;
```

</Tab>
<Tab>
For MS SQL, the `drizzle-seed` package first gathers information about all foreign key constraints that reference 
or are contained in the tables specified as the second argument(your schema) to the `reset` function.

It then iterates over those tables, drops all foreign key constraints related to each table, and truncates each table.

Finally, the package recreates the original foreign key constraints for each table.

```sql
-- gather information about all fk constraints

-- drops all fk constraints related to each table
ALTER TABLE [<schemaName>].[<tableName>] DROP CONSTRAINT [<fkName>];

-- truncates each table
TRUNCATE TABLE [<schemaName>].[<tableName>];

-- recreates the original fk constraints
ALTER TABLE [<schemaName>].[<tableName>] 
ADD CONSTRAINT [<fkName>] 
FOREIGN KEY([<columnName>])
REFERENCES [<refSchemaName>].[<refTableName>] ([<refColumnName>])
ON DELETE <onDeleteAction>
ON UPDATE <onUpdateAction>;
```

</Tab>
</Tabs>

