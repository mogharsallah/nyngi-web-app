## Standalone query builder
Drizzle ORM provides a standalone query builder that allows you to build queries
without creating a database instance and get generated SQL.
<Tabs items={['PostgreSQL', 'MySQL', 'SQLite', "SingleStore", "MSSQL", "CockroachDB"]}>
    <Tab>
        ```typescript copy
        import { QueryBuilder } from 'drizzle-orm/pg-core';

        const qb = new QueryBuilder();

        const query = qb.select().from(users).where(eq(users.name, 'Dan'));
        const { sql, params } = query.toSQL();
        ```
    </Tab>
    <Tab>
        ```typescript copy
        import { QueryBuilder } from 'drizzle-orm/mysql-core';

        const qb = new QueryBuilder();

        const query = qb.select().from(users).where(eq(users.name, 'Dan'));
        const { sql, params } = query.toSQL();
        ```
    </Tab>
    <Tab>
        ```typescript copy
        import { QueryBuilder } from 'drizzle-orm/sqlite-core';

        const qb = new QueryBuilder();

        const query = qb.select().from(users).where(eq(users.name, 'Dan'));
        const { sql, params } = query.toSQL();
        ```
    </Tab>
    <Tab>
        ```typescript copy
        import { QueryBuilder } from 'drizzle-orm/singlestore-core';

        const qb = new QueryBuilder();

        const query = qb.select().from(users).where(eq(users.name, 'Dan'));
        const { sql, params } = query.toSQL();
        ```
    </Tab>
    <Tab>
        ```typescript copy
        import { QueryBuilder } from 'drizzle-orm/mssql-core';

        const qb = new QueryBuilder();

        const query = qb.select().from(users).where(eq(users.name, 'Dan'));
        const { sql, params } = query.toSQL();
        ```
    </Tab>
    <Tab>
        ```typescript copy
        import { QueryBuilder } from 'drizzle-orm/cockroach-core';

        const qb = new QueryBuilder();

        const query = qb.select().from(users).where(eq(users.name, 'Dan'));
        const { sql, params } = query.toSQL();
        ```
    </Tab>
</Tabs>

