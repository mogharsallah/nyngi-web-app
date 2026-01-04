## Why SQL-like?
**If you know SQL, you know Drizzle.**

Other ORMs and data frameworks tend to deviate/abstract you away from SQL, which 
leads to a double learning curve: needing to know both SQL and the framework's API.  

Drizzle is the opposite. 
We embrace SQL and built Drizzle to be SQL-like at its core, so you can have zero to no 
learning curve and access to the full power of SQL.  

We bring all the familiar **[SQL schema](/docs/sql-schema-declaration)**, **[queries](/docs/select)**, 
**[automatic migrations](/docs/migrations)** and **[one more thing](/docs/rqb)**. ✨

<CodeTabs items={["index.ts", "schema.ts", "migration.sql"]}>
```typescript copy
// Access your data
await db
	.select()
	.from(countries)
	.leftJoin(cities, eq(cities.countryId, countries.id))
	.where(eq(countries.id, 10))
```
```typescript copy
// manage your schema
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```
```sql
-- generate migrations
CREATE TABLE IF NOT EXISTS "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256)
);

CREATE TABLE IF NOT EXISTS "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"country_id" integer
);

ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE no action ON UPDATE no action;
```
</CodeTabs>

