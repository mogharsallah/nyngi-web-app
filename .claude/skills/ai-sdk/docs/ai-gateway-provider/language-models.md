## Language Models

You can create language models using a provider instance. The first argument is the model ID in the format `creator/model-name`:

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Explain quantum computing in simple terms',
});
```

AI Gateway language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions (see [AI SDK Core](/docs/ai-sdk-core)).

