## `sql<T>`

<Callout type="info" emoji="ℹ️">
    Please note that `sql<T>` does not perform any runtime mapping. The type you define using `sql<T>` is
    purely a helper for Drizzle. It is important to understand that there is no feasible way to 
    determine the exact type dynamically, as SQL queries can be highly versatile and customizable. 
</Callout>

You can define a custom type in Drizzle to be used in places where fields require a specific type other than `unknown`.

This feature is particularly useful in partial select queries, ensuring consistent typing for selected fields:

```typescript
// without sql<T> type defined
const response: { lowerName: unknown }[] = await db.select({
    lowerName: sql`lower(${usersTable.id})`
}).from(usersTable);

// with sql<T> type defined
const response: { lowerName: string }[] = await db.select({
    lowerName: sql<string>`lower(${usersTable.id})`
}).from(usersTable);
```

