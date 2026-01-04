## returning
<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'SQLite': true, 'MySQL': false, 'SingleStore': false, 'MSSQL': false, 'CockroachDB': true }} />
You can insert a row and get it back in PostgreSQL and SQLite like such:
```typescript copy
await db.insert(users).values({ name: "Dan" }).returning();

// partial return
await db.insert(users).values({ name: "Partial Dan" }).returning({ insertedId: users.id });
```

