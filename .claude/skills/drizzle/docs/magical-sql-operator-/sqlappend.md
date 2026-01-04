## sql.append()

If you have already generated SQL using the `sql` template, you can achieve the same behavior as `fromList`
by using the append function to directly add a new chunk to the generated SQL.

By using the append function, you can dynamically add additional SQL chunks to the existing SQL string,
effectively concatenating them together. This allows you to incorporate custom logic or business 
rules for aggregating the chunks into the final SQL query.

<Section>
```typescript 
const finalSql = sql`select * from users`;

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
</Section>

