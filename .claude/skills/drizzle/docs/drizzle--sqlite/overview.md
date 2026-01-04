# Drizzle \<\> SQLite

Drizzle has native support for SQLite connections with the `libsql` and `better-sqlite3` drivers.
  
There are a few differences between the `libsql` and `better-sqlite3` drivers that we discovered while using both and integrating them with the Drizzle ORM. For example:

At the driver level, there may not be many differences between the two, but the main one is that `libSQL` can connect to both SQLite files and `Turso` remote databases. LibSQL is a fork of SQLite that offers a bit more functionality compared to standard SQLite, such as:

- More ALTER statements are available with the `libSQL` driver, allowing you to manage your schema more easily than with just `better-sqlite3`.
- You can configure the encryption at rest feature natively.
- A large set of extensions supported by the SQLite database is also supported by `libSQL`.

