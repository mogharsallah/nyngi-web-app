## Partial select
If you need to select a particular subset of fields or to have a flat response type, Drizzle ORM
supports joins with partial select and will automatically infer return type based on `.select({ ... })` structure.
<Section>
```typescript copy
await db.select({
  userId: users.id,
  petId: pets.id,
}).from(user).leftJoin(pets, eq(users.id, pets.ownerId))
```
```sql
select "users"."id", "pets"."id" from "users" left join "pets" on "users"."id" = "pets"."owner_id"
```
```typescript
// result type
const result: {
  userId: number;
  petId: number | null;
}[];
```
</Section>
You might've noticed that `petId` can be null now, it's because we're left joining and there can be users without a pet.

It's very important to keep in mind when using `sql` operator for partial selection fields and aggregations when needed,
you should to use `sql<type | null>` for proper result type inference, that one is on you!
<Section>
```typescript copy
const result = await db.select({
  userId: users.id,
  petId: pets.id,
  petName1: sql`upper(${pets.name})`,
  petName2: sql<string | null>`upper(${pets.name})`,
  //˄we should explicitly tell 'string | null' in type, since we're left joining that field
}).from(user).leftJoin(pets, eq(users.id, pets.ownerId))
```
```sql
select "users"."id", "pets"."id", upper("pets"."name")... from "users" left join "pets" on "users"."id" = "pets"."owner_id"
```
```typescript
// result type
const result: {
  userId: number;
  petId: number | null;
  petName1: unknown;
  petName2: string | null;
}[];
```
</Section>
To avoid plethora of nullable fields when joining tables with lots of columns we can utilise our **nested select object syntax**,
our smart type inference will make whole object nullable instead of making all table fields nullable!
<Section>
```typescript copy
await db.select({
  userId: users.id,
  userName: users.name,
  pet: {
    id: pets.id,
    name: pets.name,
    upperName: sql<string>`upper(${pets.name})`
  }
}).from(user).fullJoin(pets, eq(users.id, pets.ownerId))
```
```sql
select ... from "users" full join "pets" on "users"."id" = "pets"."owner_id"
```
```typescript
// result type
const result: {
    userId: number | null;
    userName: string | null;
    pet: {
        id: number;
        name: string;
        upperName: string;
    } | null;
}[];
```
</Section>

