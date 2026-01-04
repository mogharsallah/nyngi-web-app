## Using with Neon

The Neon Team helped us implement their vision of a wrapper on top of our raw policies API. We defined a specific 
`/neon` import with the `crudPolicy` function that includes predefined functions and Neon's default roles.

Here's an example of how to use the `crudPolicy` function:

```ts
import { crudPolicy } from 'drizzle-orm/neon';
import { integer, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	crudPolicy({ role: admin, read: true, modify: false }),
]);
```

This policy is equivalent to:

```ts
import { sql } from 'drizzle-orm';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy(`crud-${admin.name}-policy-insert`, {
		for: 'insert',
		to: admin,
		withCheck: sql`false`,
	}),
	pgPolicy(`crud-${admin.name}-policy-update`, {
		for: 'update',
		to: admin,
		using: sql`false`,
		withCheck: sql`false`,
	}),
	pgPolicy(`crud-${admin.name}-policy-delete`, {
		for: 'delete',
		to: admin,
		using: sql`false`,
	}),
	pgPolicy(`crud-${admin.name}-policy-select`, {
		for: 'select',
		to: admin,
		using: sql`true`,
	}),
]);
```

`Neon` exposes predefined `authenticated` and `anaonymous` roles and related functions. If you are using `Neon` for RLS, you can use these roles, which are marked as existing, and the related functions in your RLS queries.

```ts
// drizzle-orm/neon
export const authenticatedRole = pgRole('authenticated').existing();
export const anonymousRole = pgRole('anonymous').existing();

export const authUid = (userIdColumn: AnyPgColumn) => sql`(select auth.user_id() = ${userIdColumn})`;

export const neonIdentitySchema = pgSchema('neon_identity');

export const usersSync = neonIdentitySchema.table('users_sync', {
  rawJson: jsonb('raw_json').notNull(),
  id: text().primaryKey().notNull(),
  name: text(),
  email: text(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});
```

For example, you can use the `Neon` predefined roles and functions like this:


```ts
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/neon';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy(`policy-insert`, {
		for: 'insert',
		to: authenticatedRole,
		withCheck: sql`false`,
	}),
]);
```

