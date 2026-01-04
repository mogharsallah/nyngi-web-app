## sql.join()

Indeed, the `sql.join` function serves a similar purpose to the fromList helper. 
However, it provides additional flexibility when it comes to handling spaces between
SQL chunks or specifying custom separators for concatenating the SQL chunks.

With `sql.join`, you can concatenate SQL chunks together using a specified separator. 
This separator can be any string or character that you want to insert between the chunks. 

This is particularly useful when you have specific requirements for formatting or delimiting 
the SQL chunks. By specifying a custom separator, you can achieve the desired structure and formatting 
in the final SQL query.

<Section>
```typescript
const sqlChunks: SQL[] = [];

sqlChunks.push(sql`select * from users`);

// some logic

sqlChunks.push(sql`where`);

// some logic

for (let i = 0; i < 5; i++) {
	sqlChunks.push(sql`id = ${i}`);

if (i === 4) continue;
    sqlChunks.push(sql`or`);
}

const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));
```
```sql
select * from users where id = $1 or id = $2 or id = $3 or id = $4 or id = $5; --> [0, 1, 2, 3, 4]
```
</Section>

