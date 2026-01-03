## Language Models

You can create models that call the [Cohere chat API](https://docs.cohere.com/v2/docs/chat-api) using a provider instance.
The first argument is the model id, e.g. `command-r-plus`.
Some Cohere chat models support tool calls.

```ts
const model = cohere('command-r-plus');
```

### Example

You can use Cohere language models to generate text with the `generateText` function:

```ts
import { cohere } from '@ai-sdk/cohere';
import { generateText } from 'ai';

const { text } = await generateText({
  model: cohere('command-r-plus'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

Cohere language models can also be used in the `streamText`, `generateObject`, and `streamObject` functions
(see [AI SDK Core](/docs/ai-sdk-core).

### Model Capabilities

| Model                         | Image Input         | Object Generation   | Tool Usage          | Tool Streaming      |
| ----------------------------- | ------------------- | ------------------- | ------------------- | ------------------- |
| `command-a-03-2025`           | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `command-a-reasoning-08-2025` | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `command-r7b-12-2024`         | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `command-r-plus-04-2024`      | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `command-r-plus`              | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `command-r-08-2024`           | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `command-r-03-2024`           | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `command-r`                   | <Cross size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `command`                     | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> |
| `command-nightly`             | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> |
| `command-light`               | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> |
| `command-light-nightly`       | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> | <Cross size={18} /> |

<Note>
  The table above lists popular models. Please see the [Cohere
  docs](https://docs.cohere.com/v2/docs/models#command) for a full list of
  available models. You can also pass any available provider model ID as a
  string if needed.
</Note>

#### Reasoning

Cohere has introduced reasoning with the `command-a-reasoning-08-2025` model. You can learn more at https://docs.cohere.com/docs/reasoning.

```ts
import { cohere } from '@ai-sdk/cohere';
import { generateText } from 'ai';

async function main() {
  const { text, reasoning } = await generateText({
    model: cohere('command-a-reasoning-08-2025'),
    prompt:
      "Alice has 3 brothers and she also has 2 sisters. How many sisters does Alice's brother have?",
    // optional: reasoning options
    providerOptions: {
      cohere: {
        thinking: {
          type: 'enabled',
          tokenBudget: 100,
        },
      },
    },
  });

  console.log(reasoning);
  console.log(text);
}

main().catch(console.error);
```

