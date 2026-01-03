## Provider Instance

To use NVIDIA NIM, you can create a custom provider instance with the `createOpenAICompatible` function from `@ai-sdk/openai-compatible`:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const nim = createOpenAICompatible({
  name: 'nim',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.NIM_API_KEY}`,
  },
});
```

<Note>
  You can obtain an API key and free credits by registering at [NVIDIA
  Build](https://build.nvidia.com/explore/discover). New users receive 1,000
  inference credits to get started.
</Note>

