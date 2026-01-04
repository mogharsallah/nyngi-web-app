## Aliases & Selfjoins
Drizzle ORM supports table aliases which comes really handy when you need to do selfjoins.

Lets say you need to fetch users with their parents:
<CodeTabs items={["index.ts", "schema.ts"]}>
<CodeTab>
```typescript copy
import { user } from "./schema";

const parent = alias(user, "parent");
const result = db
  .select()
  .from(user)
  .leftJoin(parent, eq(parent.id, user.parentId));
```
```sql
select ... from "user" left join "user" "parent" on "parent"."id" = "user"."parent_id"
```
```typescript
// result type
const result: {
    user: {
        id: number;
        name: string;
        parentId: number;
    };
    parent: {
        id: number;
        name: string;
        parentId: number;
    } | null;
}[];
```
</CodeTab>

```typescript
export const user = pgTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  parentId: integer("parent_id").notNull().references((): AnyPgColumn => user.id)
});
```

</CodeTabs>

