# Row-Level Security (RLS)

With Drizzle, you can enable Row-Level Security (RLS) for any Postgres table, create policies with various options, and define and manage the roles those policies apply to.

Drizzle supports a raw representation of Postgres policies and roles that can be used in any way you want. This works with popular Postgres database providers such as `Neon` and `Supabase`.

In Drizzle, we have specific predefined RLS roles and functions for RLS with both database providers, but you can also define your own logic.

