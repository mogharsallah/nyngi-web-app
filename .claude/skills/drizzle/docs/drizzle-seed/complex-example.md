## Complex example

<CodeTabs items={["main.ts", "schema.ts"]}>
<Section>
```ts
import { seed } from "drizzle-seed";
import * as schema from "./schema.ts";

const main = async () => {
    const titlesOfCourtesy = ["Ms.", "Mrs.", "Dr."];
    const unitsOnOrders = [0, 10, 20, 30, 50, 60, 70, 80, 100];
    const reorderLevels = [0, 5, 10, 15, 20, 25, 30];
    const quantityPerUnit = [
        "100 - 100 g pieces",
        "100 - 250 g bags",
        "10 - 200 g glasses",
        "10 - 4 oz boxes",
        "10 - 500 g pkgs.",
        "10 - 500 g pkgs."
    ];
    const discounts = [0.05, 0.15, 0.2, 0.25];

    await seed(db, schema).refine((funcs) => ({
        customers: {
            count: 10000,
            columns: {
                companyName: funcs.companyName(),
                contactName: funcs.fullName(),
                contactTitle: funcs.jobTitle(),
                address: funcs.streetAddress(),
                city: funcs.city(),
                postalCode: funcs.postcode(),
                region: funcs.state(),
                country: funcs.country(),
                phone: funcs.phoneNumber({ template: "(###) ###-####" }),
                fax: funcs.phoneNumber({ template: "(###) ###-####" })
            }
        },
        employees: {
            count: 200,
            columns: {
                firstName: funcs.firstName(),
                lastName: funcs.lastName(),
                title: funcs.jobTitle(),
                titleOfCourtesy: funcs.valuesFromArray({ values: titlesOfCourtesy }),
                birthDate: funcs.date({ minDate: "2010-12-31", maxDate: "2010-12-31" }),
                hireDate: funcs.date({ minDate: "2010-12-31", maxDate: "2024-08-26" }),
                address: funcs.streetAddress(),
                city: funcs.city(),
                postalCode: funcs.postcode(),
                country: funcs.country(),
                homePhone: funcs.phoneNumber({ template: "(###) ###-####" }),
                extension: funcs.int({ minValue: 428, maxValue: 5467 }),
                notes: funcs.loremIpsum()
            }
        },
        orders: {
            count: 50000,
            columns: {
                shipVia: funcs.int({ minValue: 1, maxValue: 3 }),
                freight: funcs.number({ minValue: 0, maxValue: 1000, precision: 100 }),
                shipName: funcs.streetAddress(),
                shipCity: funcs.city(),
                shipRegion: funcs.state(),
                shipPostalCode: funcs.postcode(),
                shipCountry: funcs.country()
            },
            with: {
                details:
                    [
                        { weight: 0.6, count: [1, 2, 3, 4] },
                        { weight: 0.2, count: [5, 6, 7, 8, 9, 10] },
                        { weight: 0.15, count: [11, 12, 13, 14, 15, 16, 17] },
                        { weight: 0.05, count: [18, 19, 20, 21, 22, 23, 24, 25] },
                    ]
            }
        },
        suppliers: {
            count: 1000,
            columns: {
                companyName: funcs.companyName(),
                contactName: funcs.fullName(),
                contactTitle: funcs.jobTitle(),
                address: funcs.streetAddress(),
                city: funcs.city(),
                postalCode: funcs.postcode(),
                region: funcs.state(),
                country: funcs.country(),
                phone: funcs.phoneNumber({ template: "(###) ###-####" })
            }
        },
        products: {
            count: 5000,
            columns: {
                name: funcs.companyName(),
                quantityPerUnit: funcs.valuesFromArray({ values: quantityPerUnit }),
                unitPrice: funcs.weightedRandom(
                    [
                        {
                            weight: 0.5,
                            value: funcs.int({ minValue: 3, maxValue: 300 })
                        },
                        {
                            weight: 0.5,
                            value: funcs.number({ minValue: 3, maxValue: 300, precision: 100 })
                        }
                    ]
                ),
                unitsInStock: funcs.int({ minValue: 0, maxValue: 125 }),
                unitsOnOrder: funcs.valuesFromArray({ values: unitsOnOrders }),
                reorderLevel: funcs.valuesFromArray({ values: reorderLevels }),
                discontinued: funcs.int({ minValue: 0, maxValue: 1 })
            }
        },
        details: {
            columns: {
                unitPrice: funcs.number({ minValue: 10, maxValue: 130 }),
                quantity: funcs.int({ minValue: 1, maxValue: 130 }),
                discount: funcs.weightedRandom(
                    [
                        { weight: 0.5, value: funcs.valuesFromArray({ values: discounts }) },
                        { weight: 0.5, value: funcs.default({ defaultValue: 0 }) }
                    ]
                )
            }
        }
    }));
}

main();

```
</Section>
<Section>
```ts
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { integer, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const customers = pgTable('customer', {
	id: varchar({ length: 256 }).primaryKey(),
	companyName: text().notNull(),
	contactName: text().notNull(),
	contactTitle: text().notNull(),
	address: text().notNull(),
	city: text().notNull(),
	postalCode: text(),
	region: text(),
	country: text().notNull(),
	phone: text().notNull(),
	fax: text(),
});

export const employees = pgTable(
	'employee',
	{
		id: integer().primaryKey(),
		lastName: text().notNull(),
		firstName: text(),
		title: text().notNull(),
		titleOfCourtesy: text().notNull(),
		birthDate: timestamp().notNull(),
		hireDate: timestamp().notNull(),
		address: text().notNull(),
		city: text().notNull(),
		postalCode: text().notNull(),
		country: text().notNull(),
		homePhone: text().notNull(),
		extension: integer().notNull(),
		notes: text().notNull(),
		reportsTo: integer().references((): AnyPgColumn => employees.id),
		photoPath: text(),
	},
);

export const orders = pgTable('order', {
	id: integer().primaryKey(),
	orderDate: timestamp().notNull(),
	requiredDate: timestamp().notNull(),
	shippedDate: timestamp(),
	shipVia: integer().notNull(),
	freight: numeric().notNull(),
	shipName: text().notNull(),
	shipCity: text().notNull(),
	shipRegion: text(),
	shipPostalCode: text(),
	shipCountry: text().notNull(),

	customerId: text().notNull().references(() => customers.id, { onDelete: 'cascade' }),

	employeeId: integer().notNull().references(() => employees.id, { onDelete: 'cascade' }),
});

export const suppliers = pgTable('supplier', {
	id: integer().primaryKey(),
	companyName: text().notNull(),
	contactName: text().notNull(),
	contactTitle: text().notNull(),
	address: text().notNull(),
	city: text().notNull(),
	region: text(),
	postalCode: text().notNull(),
	country: text().notNull(),
	phone: text().notNull(),
});

export const products = pgTable('product', {
	id: integer().primaryKey(),
	name: text().notNull(),
	quantityPerUnit: text().notNull(),
	unitPrice: numeric().notNull(),
	unitsInStock: integer().notNull(),
	unitsOnOrder: integer().notNull(),
	reorderLevel: integer().notNull(),
	discontinued: integer().notNull(),

	supplierId: integer().notNull().references(() => suppliers.id, { onDelete: 'cascade' }),
});

export const details = pgTable('order_detail', {
	unitPrice: numeric().notNull(),
	quantity: integer().notNull(),
	discount: numeric().notNull(),

	orderId: integer().notNull().references(() => orders.id, { onDelete: 'cascade' }),

	productId: integer().notNull().references(() => products.id, { onDelete: 'cascade' }),
});

```
</Section>
</CodeTabs>

