## Language Models

You can interact with local LLMs in [LM Studio](https://lmstudio.ai/docs/basics/server#endpoints-overview) using a provider instance.
The first argument is the model id, e.g. `llama-3.2-1b`.

```ts
const model = lmstudio('llama-3.2-1b');
```

###### To be able to use a model, you need to [download it first](https://lmstudio.ai/docs/basics/download-model).

### Example

You can use LM Studio language models to generate text with the `generateText` function:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';

const lmstudio = createOpenAICompatible({
  name: 'lmstudio',
  baseURL: 'https://localhost:1234/v1',
});

const { text } = await generateText({
  model: lmstudio('llama-3.2-1b'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  maxRetries: 1, // immediately error if the server is not running
});
```

LM Studio language models can also be used with `streamText`.

