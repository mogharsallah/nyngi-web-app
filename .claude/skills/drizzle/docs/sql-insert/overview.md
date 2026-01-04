# SQL Insert
Drizzle ORM provides you the most SQL-like way to insert rows into the database tables.

Inserting data with Drizzle is extremely straightforward and sql-like. See for yourself:

<Section>
```typescript copy 
await db.insert(users).values({ name: 'Andrew' });
```
```sql
insert into "users" ("name") values ("Andrew");
```
</Section>

If you need insert type for a particular table you can use `typeof usersTable.$inferInsert` syntax. 
```typescript copy 
type NewUser = typeof users.$inferInsert;

const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user);
}

const newUser: NewUser = { name: "Alef" };
await insertUser(newUser);
```

