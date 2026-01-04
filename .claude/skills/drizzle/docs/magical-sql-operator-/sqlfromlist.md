## sql.fromList()

The `sql` template generates sql chunks, which are arrays of SQL parts that will be concatenated 
into the query and params after applying the SQL to the database or query in Drizzle.

In certain scenarios, you may need to aggregate these chunks into an array using custom business 
logic and then concatenate them into a single SQL statement that can be passed to the database or query.
For such cases, the fromList function can be quite useful.

The fromList function allows you to combine multiple SQL chunks into a single SQL statement. 
You can use it to aggregate and concatenate the individual SQL parts according to your specific 
requirements and then obtain a unified SQL query that can be executed.

<Section>
```typescript
const sqlChunks: SQL[] = [];

sqlChunks.push(sql`select * from users`);

// some logic

sqlChunks.push(sql` where `);

// some logic

for (let i = 0; i < 5; i++) {
	sqlChunks.push(sql`id = ${i}`);

	if (i === 4) continue;
	sqlChunks.push(sql` or `);
}

const finalSql: SQL = sql.fromList(sqlChunks)
```
```sql
select * from users where id = $1 or id = $2 or id = $3 or id = $4 or id = $5; --> [0, 1, 2, 3, 4]
```
</Section>

