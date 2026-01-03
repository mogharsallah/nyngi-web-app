## Provider Instance

You can import the default provider instance `replicate` from `@ai-sdk/replicate`:

```ts
import { replicate } from '@ai-sdk/replicate';
```

If you need a customized setup, you can import `createReplicate` from `@ai-sdk/replicate`
and create a provider instance with your settings:

```ts
import { createReplicate } from '@ai-sdk/replicate';

const replicate = createReplicate({
  apiToken: process.env.REPLICATE_API_TOKEN ?? '',
});
```

You can use the following optional settings to customize the Replicate provider instance:

- **baseURL** _string_

  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://api.replicate.com/v1`.

- **apiToken** _string_

  API token that is being sent using the `Authorization` header. It defaults to
  the `REPLICATE_API_TOKEN` environment variable.

- **headers** _Record&lt;string,string&gt;_

  Custom headers to include in the requests.

- **fetch** _(input: RequestInfo, init?: RequestInit) => Promise&lt;Response&gt;_

  Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.

