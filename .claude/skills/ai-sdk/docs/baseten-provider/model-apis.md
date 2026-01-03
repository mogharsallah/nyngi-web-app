## Model APIs

You can select [Baseten models](https://www.baseten.co/products/model-apis/) using a provider instance.
The first argument is the model id, e.g. `'moonshotai/Kimi-K2-Instruct-0905'`: The complete supported models under Model APIs can be found [here](https://docs.baseten.co/development/model-apis/overview#supported-models).

```ts
const model = baseten('moonshotai/Kimi-K2-Instruct-0905');
```

### Example

You can use Baseten language models to generate text with the `generateText` function:

```ts
import { baseten } from '@ai-sdk/baseten';
import { generateText } from 'ai';

const { text } = await generateText({
  model: baseten('moonshotai/Kimi-K2-Instruct-0905'),
  prompt: 'What is the meaning of life? Answer in one sentence.',
});
```

Baseten language models can also be used in the `streamText` function
(see [AI SDK Core](/docs/ai-sdk-core)).

