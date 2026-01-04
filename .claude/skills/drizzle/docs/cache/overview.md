# Cache

Drizzle sends every query straight to your database by default. There are no hidden actions, no automatic caching 
or invalidation - you'll always see exactly what runs. If you want caching, you must opt in.

By default, Drizzle uses a `explicit` caching strategy (i.e. `global: false`), so nothing is ever cached unless you ask. 
This prevents surprises or hidden performance traps in your application. 
Alternatively, you can flip on `all` caching (`global: true`) so that every select will look in cache first.

