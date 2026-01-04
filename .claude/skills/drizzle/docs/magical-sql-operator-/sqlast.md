## `sql``.as<T>()`

In different cases, it can sometimes be challenging to determine how to name a custom field that you want to use.
You may encounter situations where you need to explicitly specify an alias for a 
field that will be selected. This can be particularly useful when dealing with complex queries. 

To address these scenarios, we have introduced a helpful `.as('alias_name')` helper, which allows 
you to define an alias explicitly. By utilizing this feature, you can provide a clear and meaningful 
name for the field, making your queries more intuitive and readable.

<Section>
```typescript
sql`lower(usersTable.name)`.as('lower_name')
```
```sql
... "usersTable"."name" as lower_name ...
```
</Section>

