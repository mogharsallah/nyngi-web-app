## Convert `sql` to string and params

In all the previous examples, you observed the usage of SQL template syntax in TypeScript along with 
the generated SQL output.

If you need to obtain the query string and corresponding parameters generated from the SQL template, 
you must specify the database dialect you intend to generate the query for. Different databases have
varying syntax for parameterization and escaping, so selecting the appropriate dialect is crucial.

Once you have chosen the dialect, you can utilize the corresponding implementation's functionality
to convert the SQL template into the desired query string and parameter format. This ensures 
compatibility with the specific database system you are working with.

<CodeTabs items={["PostgreSQL", "MySQL", "SQLite"]}>
<CodeTab>
<Section>
```typescript copy
import { PgDialect } from 'drizzle-orm/pg-core';

const pgDialect = new PgDialect();
pgDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
```
```sql
select * from "users" where "users"."id" = $1; --> [ 12 ]
```
</Section>

</CodeTab>
<CodeTab>
<Section>
```typescript copy
import { MySqlDialect } from 'drizzle-orm/mysql-core';

const mysqlDialect = new MySqlDialect();
mysqlDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
```
```sql
select * from `users` where `users`.`id` = ?; --> [ 12 ]
```
</Section>
</CodeTab>
<CodeTab>
<Section>
```typescript copy
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';

const sqliteDialect = new SQLiteSyncDialect();
sqliteDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
```
```sql
select * from "users" where "users"."id" = ?; --> [ 12 ]
```
</Section>
</CodeTab>
</CodeTabs>

