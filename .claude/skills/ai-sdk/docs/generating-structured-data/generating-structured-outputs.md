## Generating Structured Outputs

Use `generateText` with `Output.object()` to generate structured data from a prompt.
The schema is also used to validate the generated data, ensuring type safety and correctness.

```ts
import { generateText, Output } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const { output } = await generateText({
  model: __MODEL__,
  output: Output.object({
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({ name: z.string(), amount: z.string() }),
        ),
        steps: z.array(z.string()),
      }),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

<Note>
  Structured output generation counts as a step in the AI SDK's multi-turn
  execution model (where each model call or tool execution is one step). When
  combining with tools, account for this in your `stopWhen` configuration.
</Note>

### Accessing response headers & body

Sometimes you need access to the full response from the model provider,
e.g. to access some provider-specific headers or body content.

You can access the raw response headers and body using the `response` property:

```ts
import { generateText, Output } from 'ai';

const result = await generateText({
  // ...
  output: Output.object({ schema }),
});

console.log(JSON.stringify(result.response.headers, null, 2));
console.log(JSON.stringify(result.response.body, null, 2));
```

