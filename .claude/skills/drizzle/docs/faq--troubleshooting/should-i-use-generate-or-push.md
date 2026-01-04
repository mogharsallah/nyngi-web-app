## **Should I use `generate` or `push`?**

Those are logically 2 different commands. `generate` is used to create an sql file together with additional
information needed for `drizzle-kit` (or any other migration tool).

After generating those migrations, they won't be applied to a database. 
You need to do it in the next step. You can read more about it **[here](/docs/migrations)**

On the other hand, `push` doesn't need any migrations to be generated. It will
simply sync your schema with the database schema. Please be careful when using it;
we recommend it only for local development and local databases. To read more about it, check out **[`drizzle-kit push`](/docs/drizzle-kit-push)**

