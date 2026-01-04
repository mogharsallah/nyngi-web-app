## Join types
Drizzle ORM has APIs for `INNER JOIN [LATERAL]`, `FULL JOIN`, `LEFT JOIN [LATERAL]`, `RIGHT JOIN`, `CROSS JOIN [LATERAL]`.
Lets have a quick look at examples based on below table schemas:
```typescript copy
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const pets = pgTable('pets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: integer('owner_id').notNull().references(() => users.id),
})
```

### Left Join
<Section>
```typescript copy
const result = await db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))
```
```sql
select ... from "users" left join "pets" on "users"."id" = "pets"."owner_id"
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
    };
    pets: {
        id: number;
        name: string;
        ownerId: number;
    } | null;
}[];
```
</Section>

### Left Join Lateral
<Section>
```typescript copy
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).leftJoinLateral(subquery, sql`true`)
```
```sql
select ... from "users" left join lateral (select ... from "pets" where "users"."age" >= 16) "userPets" on true
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
    };
    userPets: {
        id: number;
        name: string;
        ownerId: number;
    } | null;
}[];
```
</Section>

### Right Join
<Section>
```typescript copy
const result = await db.select().from(users).rightJoin(pets, eq(users.id, pets.ownerId))
```
```sql
select ... from "users" right join "pets" on "users"."id" = "pets"."owner_id"
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
    } | null;
    pets: {
        id: number;
        name: string;
        ownerId: number;
    };
}[];
```
</Section>

### Inner Join
<Section>
```typescript copy
const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
```
```sql
select ... from "users" inner join "pets" on "users"."id" = "pets"."owner_id"
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
    };
    pets: {
        id: number;
        name: string;
        ownerId: number;
    };
}[];
```
</Section>

### Inner Join Lateral
<Section>
```typescript copy
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).innerJoinLateral(subquery, sql`true`)
```
```sql
select ... from "users" inner join lateral (select ... from "pets" where "users"."age" >= 16) "userPets" on true
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
    };
    userPets: {
        id: number;
        name: string;
        ownerId: number;
    };
}[];
```
</Section>

### Full Join
<Section>
```typescript copy
const result = await db.select().from(users).fullJoin(pets, eq(users.id, pets.ownerId))
```
```sql
select ... from "users" full join "pets" on "users"."id" = "pets"."owner_id"
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
    } | null;
    pets: {
        id: number;
        name: string;
        ownerId: number;
    } | null;
}[];
```
</Section>

### Cross Join
<Section>
```typescript copy
const result = await db.select().from(users).crossJoin(pets)
```
```sql
select ... from "users" cross join "pets"
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
    };
    pets: {
        id: number;
        name: string;
        ownerId: number;
    };
}[];
```
</Section>

### Cross Join Lateral
<Section>
```typescript copy
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).crossJoinLateral(subquery)
```
```sql
select ... from "users" cross join lateral (select ... from "pets" where "users"."age" >= 16) "userPets"
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
    };
    userPets: {
        id: number;
        name: string;
        ownerId: number;
    };
}[];
```
</Section>

