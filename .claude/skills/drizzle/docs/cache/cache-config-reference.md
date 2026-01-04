## Cache config reference

Drizzle supports the following cache config options for Upstash:

```ts
export type CacheConfig = {
  /**
   * Expiration in seconds (positive integer)
   */
  ex?: number;
  /**
   * Set an expiration (TTL or time to live) on one or more fields of a given hash key.
   * Used for HEXPIRE command
   */
  hexOptions?: "NX" | "nx" | "XX" | "xx" | "GT" | "gt" | "LT" | "lt";
};
```

