## Weighted Random

There may be cases where you need to use multiple datasets with a different priority that should be inserted into your database during the seed stage. For such cases, drizzle-seed provides an API called weighted random

The Drizzle Seed package has a few places where weighted random can be used:

- Columns inside each table refinements
- The `with` property, determining the amount of related entities to be created

Let's check an example for both:

```ts filename="schema.ts"
import { pgTable, integer, text, varchar, doublePrecision } from "drizzle-orm/pg-core";

export const orders = pgTable(
  "orders",
  {
    id: integer().primaryKey(),
    name: text().notNull(),
    quantityPerUnit: varchar().notNull(),
    unitPrice: doublePrecision().notNull(),
    unitsInStock: integer().notNull(),
    unitsOnOrder: integer().notNull(),
    reorderLevel: integer().notNull(),
    discontinued: integer().notNull(),
  }
);

export const details = pgTable(
  "details",
  {
    unitPrice: doublePrecision().notNull(),
    quantity: integer().notNull(),
    discount: doublePrecision().notNull(),

    orderId: integer()
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
  }
);
```

**Example 1**: Refine the `unitPrice` generation logic to generate `5000` random prices, with a 30% chance of prices between 10-100 and a 70% chance of prices between 100-300

```ts filename="index.ts"
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import * as schema from './schema.ts'

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  await seed(db, schema).refine((f) => ({
    orders: {
       count: 5000,
       columns: {
           unitPrice: f.weightedRandom(
               [
                   {
                       weight: 0.3,
                       value: funcs.int({ minValue: 10, maxValue: 100 })
                   },
                   {
                       weight: 0.7,
                       value: funcs.number({ minValue: 100, maxValue: 300, precision: 100 })
                   }
               ]
           ),
       }
    }
  }));
}

main();
```

**Example 2**: For each order, generate 1 to 3 details with a 60% chance, 5 to 7 details with a 30% chance, and 8 to 10 details with a 10% chance

```ts filename="index.ts"
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import * as schema from './schema.ts'

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  await seed(db, schema).refine((f) => ({
    orders: {
       with: {
           details:
               [
                   { weight: 0.6, count: [1, 2, 3] },
                   { weight: 0.3, count: [5, 6, 7] },
                   { weight: 0.1, count: [8, 9, 10] },
               ]
       }
    }
  }));
}

main();
```

