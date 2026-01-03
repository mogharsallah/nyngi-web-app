## Language Models

You can create [Groq models](https://console.groq.com/docs/models) using a provider instance.
The first argument is the model id, e.g. `gemma2-9b-it`.

```ts
const model = groq('gemma2-9b-it');
```

### Reasoning Models

Groq offers several reasoning models such as `qwen-qwq-32b` and `deepseek-r1-distill-llama-70b`.
You can configure how the reasoning is exposed in the generated text by using the `reasoningFormat` option.
It supports the options `parsed`, `hidden`, and `raw`.

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const result = await generateText({
  model: groq('qwen/qwen3-32b'),
  providerOptions: {
    groq: {
      reasoningFormat: 'parsed',
      reasoningEffort: 'default',
      parallelToolCalls: true, // Enable parallel function calling (default: true)
      user: 'user-123', // Unique identifier for end-user (optional)
      serviceTier: 'flex', // Use flex tier for higher throughput (optional)
    },
  },
  prompt: 'How many "r"s are in the word "strawberry"?',
});
```

The following optional provider options are available for Groq language models:

- **reasoningFormat** _'parsed' | 'raw' | 'hidden'_

  Controls how reasoning is exposed in the generated text. Only supported by reasoning models like `qwen-qwq-32b` and `deepseek-r1-distill-*` models.

  For a complete list of reasoning models and their capabilities, see [Groq's reasoning models documentation](https://console.groq.com/docs/reasoning).

- **reasoningEffort** _'low' | 'meduim' | 'high' | 'none' | 'default'_

  Controls the level of effort the model will put into reasoning.

  - `qwen/qwen3-32b`
    - Supported values:
      - `none`: Disable reasoning. The model will not use any reasoning tokens.
      - `default`: Enable reasoning.
  - `gpt-oss20b/gpt-oss120b`
    - Supported values:
      - `low`: Use a low level of reasoning effort.
      - `medium`: Use a medium level of reasoning effort.
      - `high`: Use a high level of reasoning effort.

  Defaults to `default` for `qwen/qwen3-32b.`

- **structuredOutputs** _boolean_

  Whether to use structured outputs.

  Defaults to `true`.

  When enabled, object generation will use the `json_schema` format instead of `json_object` format, providing more reliable structured outputs.

- **parallelToolCalls** _boolean_

  Whether to enable parallel function calling during tool use. Defaults to `true`.

- **user** _string_

  A unique identifier representing your end-user, which can help with monitoring and abuse detection.

- **serviceTier** _'on_demand' | 'flex' | 'auto'_

  Service tier for the request. Defaults to `'on_demand'`.

  - `'on_demand'`: Default tier with consistent performance and fairness
  - `'flex'`: Higher throughput tier (10x rate limits) optimized for workloads that can handle occasional request failures
  - `'auto'`: Uses on_demand rate limits first, then falls back to flex tier if exceeded

  For more details about service tiers and their benefits, see [Groq's Flex Processing documentation](https://console.groq.com/docs/flex-processing).

<Note>Only Groq reasoning models support the `reasoningFormat` option.</Note>

#### Structured Outputs

Structured outputs are enabled by default for Groq models.
You can disable them by setting the `structuredOutputs` option to `false`.

```ts
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';

const result = await generateObject({
  model: groq('moonshotai/kimi-k2-instruct-0905'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a simple pasta recipe.',
});

console.log(JSON.stringify(result.object, null, 2));
```

You can disable structured outputs for models that don't support them:

```ts highlight="9"
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';

const result = await generateObject({
  model: groq('gemma2-9b-it'),
  providerOptions: {
    groq: {
      structuredOutputs: false,
    },
  },
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a simple pasta recipe in JSON format.',
});

console.log(JSON.stringify(result.object, null, 2));
```

<Note type="warning">
  Structured outputs are only supported by newer Groq models like
  `moonshotai/kimi-k2-instruct-0905`. For unsupported models, you can disable
  structured outputs by setting `structuredOutputs: false`. When disabled, Groq
  uses the `json_object` format which requires the word "JSON" to be included in
  your messages.
</Note>

### Example

You can use Groq language models to generate text with the `generateText` function:

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const { text } = await generateText({
  model: groq('gemma2-9b-it'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### Image Input

Groq's multi-modal models like `meta-llama/llama-4-scout-17b-16e-instruct` support image inputs. You can include images in your messages using either URLs or base64-encoded data:

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const { text } = await generateText({
  model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What do you see in this image?' },
        {
          type: 'image',
          image: 'https://example.com/image.jpg',
        },
      ],
    },
  ],
});
```

You can also use base64-encoded images:

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { readFileSync } from 'fs';

const imageData = readFileSync('path/to/image.jpg', 'base64');

const { text } = await generateText({
  model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe this image in detail.' },
        {
          type: 'image',
          image: `data:image/jpeg;base64,${imageData}`,
        },
      ],
    },
  ],
});
```

