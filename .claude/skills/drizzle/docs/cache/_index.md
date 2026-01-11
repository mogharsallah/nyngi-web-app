# Cache

Drizzle sends every query straight to your database by default. There are no hidden actions, no automatic caching 
or invalidation - you'll always see exactly what runs. If you want caching, you must ...

## Topics (50 files, ~29,233 tokens)

- [Overview](overview.md) - Drizzle sends every query straight to your database by default. There are no hid
- [Quickstart](quickstart.md) - Drizzle provides an `upstashCache()` helper out of the box. By default, this use
- [Cache config reference](cache-config-reference.md) - Drizzle supports the following cache config options for Upstash:
- [Cache usage examples](cache-usage-examples.md) - Once you've configured caching, here's how the cache behaves:
- [Custom cache](custom-cache.md) - This example shows how to plug in a custom `cache` in Drizzle: you provide funct
- [Limitations](limitations.md) - - Using cache with raw queries, such as:
- [---](---.md) - `text` `varchar`, `char`
- [---](---.md) - https://www.cockroachlabs.com/docs/stable/float
- [---](---.md) - `jsonb`
- [---](---.md) - `bit`
- [---](---.md) - `uuid`
- [---](---.md) - `time` `timetz` `time with timezone` `time without timezone`
- [---](---.md) - `enum` `enumerated types`
- [---](---.md) - Every column builder has a `.$type()` method, which allows you to customize the 
- [---](---.md) - An integer data type that can take a value of `1`, `0`, or `NULL`
- [---](---.md) - `text`
- [---](---.md) - Fixed-length binary data with a length of n bytes, where n is a value from 1 thr
- [---](---.md) - `numeric`
- [---](---.md) - `time`
- [---](---.md) - Every column builder has a `.$type()` method, which allows you to customize the 
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - `BINARY(M)` stores a fixed-length byte string of exactly M bytes.
- [---](---.md) - <Callout type='warning'>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - Every column builder has a `.$type()` method, which allows you to customize the 
- [---](---.md) - `serial` `serial4`
- [---](---.md) - PostgreSQL provides the standard SQL type bytea.
- [---](---.md) - `text`
- [---](---.md) - `numeric` `decimal`
- [---](---.md) - `json`
- [---](---.md) - `uuid`
- [---](---.md) - `time` `timetz` `time with timezone` `time without timezone`
- [---](---.md) - `point`
- [---](---.md) - `enum` `enumerated types`
- [---](---.md) - Every column builder has a `.$type()` method, which allows you to customize the 
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - <Section>
- [---](---.md) - Every column builder has a `.$type()` method, which allows you to customize the 
- [---](---.md) - Every column builder has a `.$type()` method, which allows you to customize the 