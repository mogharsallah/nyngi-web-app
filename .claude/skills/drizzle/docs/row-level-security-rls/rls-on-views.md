## RLS on views

With Drizzle, you can also specify RLS policies on views. For this, you need to use `security_invoker` in the view's WITH options. Here is a small example:

```ts {5}
...

export const roomsUsersProfiles = pgView("rooms_users_profiles")
  .with({
    securityInvoker: true,
  })
  .as((qb) =>
    qb
      .select({
        ...getTableColumns(roomsUsers),
        email: profiles.email,
      })
      .from(roomsUsers)
      .innerJoin(profiles, eq(roomsUsers.userId, profiles.id))
  );
```

