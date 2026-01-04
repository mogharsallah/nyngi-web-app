## Limitations

#### Queries that won't be handled by the `cache` extension:

- Using cache with raw queries, such as:

```ts
db.execute(sql`select 1`);
```

- Using cache with `batch` feature in `d1` and `libsql`

```ts
db.batch([
    db.insert(users).values(...),
    db.update(users).set(...).where()
])
```

- Using cache in transactions
```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set(...).where(...);
  await tx.update...
});
```

#### Limitations that are temporary and will be handled soon:

- Using cache with Drizzle Relational Queries
```ts
await db.query.users.findMany();
```

- Using cache with `better-sqlite3`, `Durable Objects`, `expo sqlite`
- Using cache with AWS Data API drivers
- Using cache with views


Source: https://orm.drizzle.team/docs/column-types/cockroach


import Section from '@mdx/Section.astro';
import Callout from '@mdx/Callout.astro';
import Npm from '@mdx/Npm.astro';

<Callout type='error'>
This page explains concepts available on drizzle versions `1.0.0-beta.2` and higher.
</Callout>

<Npm>
drizzle-orm@beta
drizzle-kit@beta -D
</Npm>

<br/>

We have native support for all of them, yet if that's not enough for you, feel free to create **[custom types](/docs/custom-types)**.

<Callout title='important' type='warning'>
All examples in this part of the documentation do not use database column name aliases, and column names are generated from TypeScript keys. 

You can use database aliases in column names if you want, and you can also use the `casing` parameter to define a mapping strategy for Drizzle. 

You can read more about it [here](/docs/sql-schema-declaration#shape-your-data-schema)
</Callout>

### bigint
`int` `int8` `int64` `integer`

Signed 8-byte integer     

If you're expecting values above 2^31 but below 2^53, you can utilize `mode: 'number'` and deal with javascript number as opposed to bigint.
<Section>
```typescript
import { bigint, cockroachTable } from "drizzle-orm/cockroach-core";

export const table = cockroachTable('table', {
	bigint: bigint({ mode: 'number' })
});

// will be inferred as `number`
bigint: bigint({ mode: 'number' })

// will be inferred as `bigint`
bigint: bigint({ mode: 'bigint' })
```

```sql
CREATE TABLE "table" (
	"bigint" bigint
);
```
</Section>

<Section>
```typescript
import { sql } from "drizzle-orm";
import { bigint, cockroachTable } from "drizzle-orm/cockroach-core";

export const table = cockroachTable('table', {
	bigint1: bigint().default(10),
	bigint2: bigint().default(sql`'10'::bigint`)
});
```

```sql
CREATE TABLE "table" (
	"bigint1" bigint DEFAULT 10,
	"bigint2" bigint DEFAULT '10'::bigint
);
```
</Section>

### smallint
`smallint` `int2`  
Small-range signed 2-byte integer   

<Section>
```typescript
import { smallint, cockroachTable } from "drizzle-orm/cockroach-core";

export const table = cockroachTable('table', {
	smallint: smallint()
});
```

```sql
CREATE TABLE "table" (
	"smallint" smallint
);
```
</Section>

<Section>
```typescript
import { sql } from "drizzle-orm";
import { smallint, cockroachTable } from "drizzle-orm/cockroach-core";

export const table = cockroachTable('table', {
	smallint1: smallint().default(10),
	smallint2: smallint().default(sql`'10'::smallint`)
});
```

```sql
CREATE TABLE "table" (
	"smallint1" smallint DEFAULT 10,
	"smallint2" smallint DEFAULT '10'::smallint
);
```
</Section>

### int4

Signed 4-byte integer     

<Section>
```typescript
import { int4, cockroachTable } from "drizzle-orm/cockroach-core";

export const table = cockroachTable('table', {
	int4: int4()
});

```

```sql
CREATE TABLE "table" (
	"int4" int4
);
```
</Section>

<Section>
```typescript
import { sql } from "drizzle-orm";
import { int4, cockroachTable } from "drizzle-orm/cockroach-core";

export const table = cockroachTable('table', {
	int1: int4().default(10),
	int2: int4().default(sql`'10'::int4`)
});
```

```sql
CREATE TABLE "table" (
	"int1" int4 DEFAULT 10,
	"int2" int4 DEFAULT '10'::int4
);
```
</Section>


### int8

An alias of **[bigint.](#bigint)**

### int2

An alias of **[smallint.](#smallint)**

### ---

### bool
Cockroach provides the standard SQL type bool.

For more info please refer to the official Cockroach **[docs.](https://www.cockroachlabs.com/docs/stable/bool)**

<Section>
```typescript
import { bool, cockroachTable } from "drizzle-orm/cockroach-core";

export const table = cockroachTable('table', {
	boolean: bool()
});

```

```sql
CREATE TABLE "table" (
	"boolean" bool
);
```
</Section>

