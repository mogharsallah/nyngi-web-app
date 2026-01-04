# Drizzle \<\> PostgreSQL
<Prerequisites>
- Database [connection basics](/docs/connect-overview) with Drizzle
- node-postgres [basics](https://node-postgres.com/)
- postgres.js [basics](https://github.com/porsager/postgres?tab=readme-ov-file#usage)
</Prerequisites>

Drizzle has native support for PostgreSQL connections with the `node-postgres` and `postgres.js` drivers.

There are a few differences between the `node-postgres` and `postgres.js` drivers that we discovered while using both and integrating them with the Drizzle ORM. For example:

- With `node-postgres`, you can install `pg-native` to boost the speed of both `node-postgres` and Drizzle by approximately 10%.
- `node-postgres` supports providing type parsers on a per-query basis without globally patching things. For more details, see [Types Docs](https://node-postgres.com/features/queries#types).
- `postgres.js` uses prepared statements by default, which you may need to opt out of. This could be a potential issue in AWS environments, among others, so please keep that in mind.
- If there's anything else you'd like to contribute, we'd be happy to receive your PRs [here](https://github.com/drizzle-team/drizzle-orm-docs/pulls)

