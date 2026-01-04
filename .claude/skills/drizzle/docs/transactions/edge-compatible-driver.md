## Edge-compatible driver

When using Drizzle ORM with Vercel Edge functions you have to use edge-compatible drivers because the functions run in [Edge runtime](https://vercel.com/docs/functions/runtimes/edge-runtime) not in Node.js runtime, so there are some limitations of standard Node.js APIs.

You can choose one of these drivers according to your database dialect:

- [Neon serverless driver](/docs/get-started-postgresql#neon) allows you to query your Neon Postgres databases from serverless and edge environments over HTTP or WebSockets in place of TCP. We recommend using this driver for connecting to `Neon Postgres`.
- [Vercel Postgres driver](/docs/get-started-postgresql#vercel-postgres) is built on top of the `Neon serverless driver`. We recommend using this driver for connecting to `Vercel Postgres`.
- [PlanetScale serverless driver](/docs/get-started-mysql#planetscale) allows you access any `MySQL` client and execute queries over an HTTP connection, which is generally not blocked by cloud providers.
- [libSQL client](/docs/get-started-sqlite#turso) allows you to access [Turso](https://docs.turso.tech/introduction) database.

