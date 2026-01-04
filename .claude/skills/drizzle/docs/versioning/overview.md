# Versioning

`drizzle-seed` uses versioning to manage outputs for static and dynamic data. To ensure true 
determinism, ensure that values remain unchanged when using the same `seed` number. If changes are made to 
static data sources or dynamic data generation logic, the version will be updated, allowing
you to choose between sticking with the previous version or using the latest.

You can upgrade to the latest `drizzle-seed` version for new features, such as additional
generators, while maintaining deterministic outputs with a previous version if needed. This
is particularly useful when you need to rely on existing deterministic data while accessing new functionality.

```ts
await seed(db, schema, { version: '2' });
```

