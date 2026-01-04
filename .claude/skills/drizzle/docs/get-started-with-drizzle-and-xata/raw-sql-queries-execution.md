## Raw SQL queries execution
If you have some complex queries to execute and `drizzle-orm` can't handle them yet,
you can use the `db.execute` method to execute raw `parametrized` queries.

<Tabs items={['PostgreSQL', 'MySQL', 'SQLite', 'SingleStore', 'MSSQL', 'CockroachDB']}>
    <Tab>
    ```ts
    const statement = sql`select * from ${users} where ${users.id} = ${userId}`;
    const res: postgres.RowList<Record<string, unknown>[]> = await db.execute(statement)
    ```
    </Tab>
    <Tab>
    ```typescript copy
    import { ..., MySqlQueryResult } from "drizzle-orm/mysql2";

    const statement = sql`select * from ${users} where ${users.id} = ${userId}`;
    const res: MySqlRawQueryResult = await db.execute(statement);
    ```
    </Tab>
    <Tab>
    ```ts
    const statement = sql`select * from ${users} where ${users.id} = ${userId}`;

    const res: unknown[] = db.all(statement)
    const res: unknown = db.get(statement)
    const res: unknown[][] = db.values(statement)
    const res: Database.RunResult = db.run(statement)
    ```
    </Tab>
    <Tab>
    ```typescript copy
    import { ..., SingleStoreQueryResult } from "drizzle-orm/singlestore";

    const statement = sql`select * from ${users} where ${users.id} = ${userId}`;
    const res: SingleStoreRawQueryResult = await db.execute(statement);
    ```
    </Tab>
        <Tab>
    ```typescript copy
    import { sql } from "drizzle-orm";

    const statement = sql`select * from ${users} where ${users.id} = ${userId}`;
    const res = await db.execute(statement);
    ```
    </Tab>
    <Tab>
    ```ts
    const statement = sql`select * from ${users} where ${users.id} = ${userId}`;
    const res = await db.execute(statement)
    ```
    </Tab>
</Tabs>


