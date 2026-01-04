## `sql``.mapWith()`

For the cases you need to make a runtime mapping for values passed from database driver to drizzle you can use `.mapWith()`

This function accepts different values, that will map response in runtime.

You can replicate a specific column mapping strategy as long as
the interface inside mapWith is the same interface that is implemented by Column.

```typescript
const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
});

//  at runtime this values will be mapped same as `text` column is mapped in drizzle
sql`...`.mapWith(usersTable.name);
```

You can also pass your own implementation for the `DriverValueDecoder` interface:

```ts 
sql``.mapWith({
	mapFromDriverValue: (value: any) => {
		const mappedValue = value;
		// mapping you want to apply
		return mappedValue;
	},
});
    
// or
sql``.mapWith(Number);
```

