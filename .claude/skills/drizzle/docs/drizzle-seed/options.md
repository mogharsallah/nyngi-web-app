## Options

**`count`**

By default, the `seed` function will create 10 entities.
However, if you need more for your tests, you can specify this in the seed options object

```ts
await seed(db, schema, { count: 1000 });
```

**`seed`**

If you need a seed to generate a different set of values for all subsequent runs, you can define a different number
in the `seed` option. Any new number will generate a unique set of values

```ts
await seed(db, schema, { seed: 12345 });
```

