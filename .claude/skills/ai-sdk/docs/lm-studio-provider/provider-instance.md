## Provider Instance

To use LM Studio, you can create a custom provider instance with the `createOpenAICompatible` function from `@ai-sdk/openai-compatible`:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'http://localhost:1234/v1',
});
```

<Note>
  LM Studio uses port `1234` by default, but you can change in the [app's Local
  Server tab](https://lmstudio.ai/docs/basics/server).
</Note>

