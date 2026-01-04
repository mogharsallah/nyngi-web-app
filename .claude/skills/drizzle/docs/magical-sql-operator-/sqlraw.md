## `sql.raw()`

There are cases where you may not need to create parameterized values from input or map tables/columns to escaped ones. 
Instead, you might simply want to generate queries as they are. For such situations, we provide the `sql.raw()` function.

The `sql.raw()` function allows you to include raw SQL statements within your queries without any additional processing or escaping.
This can be useful when you have pre-constructed SQL statements or when you need to incorporate complex or dynamic 
SQL code directly into your queries.

<Section>
```typescript
sql.raw(`select * from users where id = ${12}`);
// vs
sql`select * from users where id = ${12}`;
```
```sql
select * from users where id = 12;
--> vs
select * from users where id = $1; --> [12]
```
</Section>

You can also utilize `sql.raw()` within the sql function, enabling you to include any raw string
without escaping it through the main `sql` template function.

By using `sql.raw()` inside the `sql` function, you can incorporate unescaped raw strings 
directly into your queries. This can be particularly useful when you have specific
SQL code or expressions that should remain untouched by the template function's automatic escaping or modification.

<Section>
```typescript
sql`select * from ${usersTable} where id = ${12}`;
// vs
sql`select * from ${usersTable} where id = ${sql.raw(12)}`;
```
```sql
select * from "users" where id = $1; --> [12]
--> vs
select * from "users" where id = 12;
```
</Section>

