## Built-in Middleware

The AI SDK comes with several built-in middlewares that you can use to configure language models:

- `extractReasoningMiddleware`: Extracts reasoning information from the generated text and exposes it as a `reasoning` property on the result.
- `simulateStreamingMiddleware`: Simulates streaming behavior with responses from non-streaming language models.
- `defaultSettingsMiddleware`: Applies default settings to a language model.
- `addToolInputExamplesMiddleware`: Adds tool input examples to tool descriptions for providers that don't natively support the `inputExamples` property.

### Extract Reasoning

Some providers and models expose reasoning information in the generated text using special tags,
e.g. &lt;think&gt; and &lt;/think&gt;.

The `extractReasoningMiddleware` function can be used to extract this reasoning information and expose it as a `reasoning` property on the result.

```ts
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';

const model = wrapLanguageModel({
  model: yourModel,
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});
```

You can then use that enhanced model in functions like `generateText` and `streamText`.

The `extractReasoningMiddleware` function also includes a `startWithReasoning` option.
When set to `true`, the reasoning tag will be prepended to the generated text.
This is useful for models that do not include the reasoning tag at the beginning of the response.
For more details, see the [DeepSeek R1 guide](/docs/guides/r1#deepseek-r1-middleware).

### Simulate Streaming

The `simulateStreamingMiddleware` function can be used to simulate streaming behavior with responses from non-streaming language models.
This is useful when you want to maintain a consistent streaming interface even when using models that only provide complete responses.

```ts
import { wrapLanguageModel, simulateStreamingMiddleware } from 'ai';

const model = wrapLanguageModel({
  model: yourModel,
  middleware: simulateStreamingMiddleware(),
});
```

### Default Settings

The `defaultSettingsMiddleware` function can be used to apply default settings to a language model.

```ts
import { wrapLanguageModel, defaultSettingsMiddleware } from 'ai';

const model = wrapLanguageModel({
  model: yourModel,
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.5,
      maxOutputTokens: 800,
      providerOptions: { openai: { store: false } },
    },
  }),
});
```

### Add Tool Input Examples

The `addToolInputExamplesMiddleware` function adds tool input examples to tool descriptions.
This is useful for providers that don't natively support the `inputExamples` property on tools.
The middleware serializes the examples into the tool's description text so models can still benefit from seeing example inputs.

```ts
import { wrapLanguageModel, addToolInputExamplesMiddleware } from 'ai';

const model = wrapLanguageModel({
  model: yourModel,
  middleware: addToolInputExamplesMiddleware({
    examplesPrefix: 'Input Examples:',
  }),
});
```

When you define a tool with `inputExamples`, the middleware will append them to the tool's description:

```ts
import { generateText, tool } from 'ai';
import { z } from 'zod';

const result = await generateText({
  model, // wrapped model from above
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string(),
      }),
      inputExamples: [
        { input: { location: 'San Francisco' } },
        { input: { location: 'London' } },
      ],
    }),
  },
  prompt: 'What is the weather in Tokyo?',
});
```

The tool description will be transformed to:

```
Get the weather in a location

Input Examples:
{"location":"San Francisco"}
{"location":"London"}
```

#### Options

- `examplesPrefix` (required): A prefix text to prepend before the examples.
- `formatExample` (optional): A custom formatter function for each example. Receives the example object and its index. Default: `JSON.stringify(example.input)`.
- `removeInputExamples` (optional): Whether to remove the `inputExamples` property from the tool after adding them to the description. Default: `true`.

```ts
const model = wrapLanguageModel({
  model: yourModel,
  middleware: addToolInputExamplesMiddleware({
    examplesPrefix: 'Input Examples:',
    formatExample: (example, index) =>
      `${index + 1}. ${JSON.stringify(example.input)}`,
    removeInputExamples: true,
  }),
});
```

