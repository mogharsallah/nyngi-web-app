## Placeholder
Whenever you need to embed a dynamic runtime value - you can use the `sql.placeholder(...)` api
<Tabs items={["PostgreSQL", "MySQL", "SQLite", "SingleStore"]}>
  <Tab>
    ```ts {6,9-10,15,18}
    import { sql } from "drizzle-orm";

    const p1 = db
      .select()
      .from(customers)
      .where(eq(customers.id, sql.placeholder('id')))
      .prepare("p1")

    await p1.execute({ id: 10 }) // SELECT * FROM customers WHERE id = 10
    await p1.execute({ id: 12 }) // SELECT * FROM customers WHERE id = 12

    const p2 = db
      .select()
      .from(customers)
      .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
      .prepare("p2");

    await p2.execute({ name: '%an%' }) // SELECT * FROM customers WHERE name ilike '%an%'
    ```
  </Tab>
  <Tab>
    ```ts copy {6,9-10,15,18}
    import { sql } from "drizzle-orm";

    const p1 = db
      .select()
      .from(customers)
      .where(eq(customers.id, sql.placeholder('id')))
      .prepare()

    await p1.execute({ id: 10 }) // SELECT * FROM customers WHERE id = 10
    await p1.execute({ id: 12 }) // SELECT * FROM customers WHERE id = 12

    const p2 = db
      .select()
      .from(customers)
      .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
      .prepare();

    await p2.execute({ name: '%an%' }) // SELECT * FROM customers WHERE name ilike '%an%'
    ```
  </Tab>
  <Tab>
    ```ts copy {6,9-10,15,18}
    import { sql } from "drizzle-orm";

    const p1 = db
      .select()
      .from(customers)
      .where(eq(customers.id, sql.placeholder('id')))
      .prepare()

    p1.get({ id: 10 }) // SELECT * FROM customers WHERE id = 10
    p1.get({ id: 12 }) // SELECT * FROM customers WHERE id = 12

    const p2 = db
      .select()
      .from(customers)
      .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
      .prepare();

    p2.all({ name: '%an%' }) // SELECT * FROM customers WHERE name ilike '%an%'
    ```
  </Tab> 
  <Tab>
    ```ts copy {6,9-10,15,18}
    import { sql } from "drizzle-orm";

    const p1 = db
      .select()
      .from(customers)
      .where(eq(customers.id, sql.placeholder('id')))
      .prepare()

    await p1.execute({ id: 10 }) // SELECT * FROM customers WHERE id = 10
    await p1.execute({ id: 12 }) // SELECT * FROM customers WHERE id = 12

    const p2 = db
      .select()
      .from(customers)
      .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
      .prepare();

    await p2.execute({ name: '%an%' }) // SELECT * FROM customers WHERE name ilike '%an%'
    ```
  </Tab>
</Tabs>


Source: https://orm.drizzle.team/docs/perf-serverless

