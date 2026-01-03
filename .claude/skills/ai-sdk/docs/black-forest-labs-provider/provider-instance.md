## Provider Instance

You can import the default provider instance `blackForestLabs` from `@ai-sdk/black-forest-labs`:

```ts
import { blackForestLabs } from '@ai-sdk/black-forest-labs';
```

If you need a customized setup, you can import `createBlackForestLabs` and create a provider instance with your settings:

```ts
import { createBlackForestLabs } from '@ai-sdk/black-forest-labs';

const blackForestLabs = createBlackForestLabs({
  apiKey: 'your-api-key', // optional, defaults to BFL_API_KEY environment variable
  baseURL: 'custom-url', // optional
  headers: {
    /* custom headers */
  }, // optional
});
```

You can use the following optional settings to customize the Black Forest Labs provider instance:

- **baseURL** _string_

  Use a different URL prefix for API calls, e.g. to use a regional endpoint.
  The default prefix is `https://api.bfl.ai/v1`.

- **apiKey** _string_

  API key that is being sent using the `x-key` header.
  It defaults to the `BFL_API_KEY` environment variable.

- **headers** _Record&lt;string,string&gt;_

  Custom headers to include in the requests.

- **fetch** _(input: RequestInfo, init?: RequestInit) => Promise&lt;Response&gt;_

  Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
  You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.

