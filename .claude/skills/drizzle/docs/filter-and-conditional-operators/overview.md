# Filter and conditional operators
We natively support all dialect specific filter and conditional operators.

You can import all filter & conditional from `drizzle-orm`:
```typescript copy
import { eq, ne, gt, gte, ... } from "drizzle-orm";
```

### eq
<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'MySQL': true, 'SQLite': true, 'SingleStore': true }} />
  
Value equal to `n`
<Section>
```typescript copy
import { eq } from "drizzle-orm";

db.select().from(table).where(eq(table.column, 5));
```

```sql copy
SELECT * FROM table WHERE table.column = 5
```
</Section>


<Section>
```typescript
import { eq } from "drizzle-orm";

db.select().from(table).where(eq(table.column1, table.column2));
```

```sql
SELECT * FROM table WHERE table.column1 = table.column2
```
</Section>


### ne
<IsSupportedChipGroup chips={{ 'PostgreSQL': true, 'MySQL': true, 'SQLite': true, 'SingleStore': true }} />
  
Value is not equal to `n`  
<Section>
```typescript
import { ne } from "drizzle-orm";

db.select().from(table).where(ne(table.column, 5));
```

```sql
SELECT * FROM table WHERE table.column <> 5
```
</Section>


<Section>
```typescript
import { ne } from "drizzle-orm";

db.select().from(table).where(ne(table.column1, table.column2));
```

```sql
SELECT * FROM table WHERE table.column1 <> table.column2
```
</Section>

