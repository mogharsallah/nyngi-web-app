## output
<IsSupportedChipGroup chips={{ 'MSSQL': true }} />
You can insert a row and get it back in PostgreSQL and SQLite like such:
```typescript copy
await db.insert(users).values({ name: "Dan" }).output();

// partial return
await db.insert(users).values({ name: "Partial Dan" }).output({ insertedId: users.id });
```

