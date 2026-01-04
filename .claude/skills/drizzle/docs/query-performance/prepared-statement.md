## Prepared statement
<Tabs items={["PostgreSQL", "MySQL", "SQLite", "SingleStore"]}>
  <Tab>
    ```typescript copy {3}
    const db = drizzle(...);

    const prepared = db.select().from(customers).prepare("statement_name");
    
    const res1 = await prepared.execute();
    const res2 = await prepared.execute();
    const res3 = await prepared.execute();
    ```
  </Tab> 
  <Tab>
    ```typescript copy {3}
    const db = drizzle(...);

    const prepared = db.select().from(customers).prepare();
    
    const res1 = await prepared.execute();
    const res2 = await prepared.execute();
    const res3 = await prepared.execute();
    ```
  </Tab> 
  <Tab>
    ```typescript copy {3}
    const db = drizzle(...);

    const prepared = db.select().from(customers).prepare();
    
    const res1 = prepared.all();
    const res2 = prepared.all();
    const res3 = prepared.all();
    ```
  </Tab> 
  <Tab>
    ```typescript copy {3}
    const db = drizzle(...);

    const prepared = db.select().from(customers).prepare();
    
    const res1 = await prepared.execute();
    const res2 = await prepared.execute();
    const res3 = await prepared.execute();
    ```
  </Tab> 
</Tabs>

