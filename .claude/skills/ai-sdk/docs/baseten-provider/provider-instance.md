## Provider Instance

You can import the default provider instance `baseten` from `@ai-sdk/baseten`:

```ts
import { baseten } from '@ai-sdk/baseten';
```

If you need a customized setup, you can import `createBaseten` from `@ai-sdk/baseten`
and create a provider instance with your settings:

```ts
import { createBaseten } from '@ai-sdk/baseten';

const baseten = createBaseten({
  apiKey: process.env.BASETEN_API_KEY ?? '',
});
```

You can use the following optional settings to customize the Baseten provider instance:

- **baseURL** _string_

  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://inference.baseten.co/v1`.

- **apiKey** _string_

  API key that is being sent using the `Authorization` header. It defaults to
  the `BASETEN_API_KEY` environment variable. It is recommended you set the environment variable using `export` so you do not need to include the field everytime.
  You can grab your Baseten API Key [here](https://app.baseten.co/settings/api_keys)

- **modelURL** _string_

  Custom model URL for specific models (chat or embeddings). If not provided,
  the default Model APIs will be used.

- **headers** _Record&lt;string,string&gt;_

  Custom headers to include in the requests.

- **fetch** _(input: RequestInfo, init?: RequestInit) => Promise&lt;Response&gt;_

  Custom [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) implementation.

