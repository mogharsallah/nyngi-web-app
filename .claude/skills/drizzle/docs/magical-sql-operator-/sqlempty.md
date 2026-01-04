## sql.empty()

By using sql.empty(), you can start with a blank SQL object and then dynamically append SQL chunks to it as needed. This allows you to construct the SQL query incrementally, applying custom logic or conditions to determine the contents of each chunk.

Once you have initialized the SQL object using sql.empty(), you can take advantage of the full range
of sql template features such as parameterization, composition, and escaping. 
This empowers you to construct the SQL query in a flexible and controlled manner, 
adapting it to your specific requirements.

```typescript 
const finalSql = sql.empty();

// some logic

finalSql.append(sql`select * from users`);

// some logic

finalSql.append(sql` where `);

// some logic

for (let i = 0; i < 5; i++) {
	finalSql.append(sql`id = ${i}`);

	if (i === 4) continue;
	finalSql.append(sql` or `);
}
```
```sql
select * from users where id = $1 or id = $2 or id = $3 or id = $4 or id = $5; --> [0, 1, 2, 3, 4]
```

