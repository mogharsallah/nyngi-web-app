## Get table information
<Tabs items={['PostgreSQL', 'MySQL', 'SQLite', "SingleStore", "MSSQL", "CockroachDB"]}>
  <Tab>
    ```ts copy
    import { getTableConfig, pgTable } from 'drizzle-orm/pg-core';

    export const table = pgTable(...);

    const {
      columns,
      indexes,
      foreignKeys,
      checks,
      primaryKeys,
      name,
      schema,
    } = getTableConfig(table);
    ```
  </Tab>
  <Tab>
  ```ts copy
  import { getTableConfig, mysqlTable } from 'drizzle-orm/mysql-core';

  export const table = mysqlTable(...);

  const {
    columns,
    indexes,
    foreignKeys,
    checks,
    primaryKeys,
    name,
    schema,
  } = getTableConfig(table);
  ```
  </Tab>
  <Tab>
  ```ts copy
  import { getTableConfig, sqliteTable } from 'drizzle-orm/sqlite-core';

  export const table = sqliteTable(...);

  const {
    columns,
    indexes,
    foreignKeys,
    checks,
    primaryKeys,
    name,
    schema,
  } = getTableConfig(table);
  ```
  </Tab>
  <Tab>
  ```ts copy
  import { getTableConfig, mysqlTable } from 'drizzle-orm/singlestore-core';

  export const table = singlestoreTable(...);

  const {
    columns,
    indexes,
    checks,
    primaryKeys,
    name,
    schema,
  } = getTableConfig(table);
  ```
  </Tab>
  <Tab>
  ```ts copy
  import { getTableConfig, mssqlTable } from 'drizzle-orm/mssql-core';

  export const table = mssqlTable(...);

  const {
    columns,
    indexes,
    checks,
    primaryKeys,
    name,
    schema,
  } = getTableConfig(table);
  ```
  </Tab>
  <Tab>
    ```ts copy
    import { getTableConfig, cockroachTable } from 'drizzle-orm/cockroach-core';

    export const table = cockroachTable(...);

    const {
      columns,
      indexes,
      foreignKeys,
      checks,
      primaryKeys,
      name,
      schema,
    } = getTableConfig(table);
    ```
  </Tab>
</Tabs>

