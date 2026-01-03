## Language Models

You can create [xAI models](https://console.x.ai) using a provider instance. The
first argument is the model id, e.g. `grok-3`.

```ts
const model = xai('grok-3');
```

By default, `xai(modelId)` uses the Chat API. To use the Responses API with server-side agentic tools, explicitly use `xai.responses(modelId)`.

### Example

You can use xAI language models to generate text with the `generateText` function:

```ts
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: xai('grok-3'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

xAI language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions
(see [AI SDK Core](/docs/ai-sdk-core)).

### Provider Options

xAI chat models support additional provider options that are not part of
the [standard call settings](/docs/ai-sdk-core/settings). You can pass them in the `providerOptions` argument:

```ts
const model = xai('grok-3-mini');

await generateText({
  model,
  providerOptions: {
    xai: {
      reasoningEffort: 'high',
    },
  },
});
```

The following optional provider options are available for xAI chat models:

- **reasoningEffort** _'low' | 'medium' | 'high'_

  Reasoning effort for reasoning models.

- **store** _boolean_

  Whether to store the generation. Defaults to `true`.

- **previousResponseId** _string_

  The ID of the previous response. You can use it to continue a conversation. Defaults to `undefined`.

