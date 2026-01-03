## Basic Usage

For most use cases, you can use the AI Gateway directly with a model string:

```ts
// use plain model string with global provider
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Hello world',
});
```

```ts
// use provider instance (requires version 5.0.36 or later)
import { generateText, gateway } from 'ai';

const { text } = await generateText({
  model: gateway('openai/gpt-5'),
  prompt: 'Hello world',
});
```

The AI SDK automatically uses the AI Gateway when you pass a model string in the `creator/model-name` format.

