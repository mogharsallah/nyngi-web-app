## Provider Instance

<Note>
  The `gateway` provider instance is available from the `ai` package in version
  5.0.36 and later.
</Note>

You can also import the default provider instance `gateway` from `ai`:

```ts
import { gateway } from 'ai';
```

You may want to create a custom provider instance when you need to:

- Set custom configuration options (API key, base URL, headers)
- Use the provider in a [provider registry](/docs/ai-sdk-core/provider-management)
- Wrap the provider with [middleware](/docs/ai-sdk-core/middleware)
- Use different settings for different parts of your application

To create a custom provider instance, import `createGateway` from `ai`:

```ts
import { createGateway } from 'ai';

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? '',
});
```

You can use the following optional settings to customize the AI Gateway provider instance:

- **baseURL** _string_

  Use a different URL prefix for API calls. The default prefix is `https://ai-gateway.vercel.sh/v3/ai`.

- **apiKey** _string_

  API key that is being sent using the `Authorization` header. It defaults to
  the `AI_GATEWAY_API_KEY` environment variable.

- **headers** _Record&lt;string,string&gt;_

  Custom headers to include in the requests.

- **fetch** _(input: RequestInfo, init?: RequestInit) => Promise&lt;Response&gt;_

  Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.
  Defaults to the global `fetch` function.
  You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.

- **metadataCacheRefreshMillis** _number_

  How frequently to refresh the metadata cache in milliseconds. Defaults to 5 minutes (300,000ms).

