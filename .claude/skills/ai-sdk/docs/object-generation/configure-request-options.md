## Configure Request Options

You can configure the API endpoint, optional headers and credentials using the `api`, `headers` and `credentials` settings.

```tsx highlight="2-5"
const { submit, object } = useObject({
  api: '/api/use-object',
  headers: {
    'X-Custom-Header': 'CustomValue',
  },
  credentials: 'include',
  schema: yourSchema,
});
```

---
title: Streaming Custom Data
description: Learn how to stream custom data from the server to the client.
---

