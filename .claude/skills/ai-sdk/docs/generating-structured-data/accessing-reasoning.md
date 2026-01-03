## Accessing Reasoning

You can access the reasoning used by the language model to generate the object via the `reasoning` property on the result. This property contains a string with the model's thought process, if available.

```ts
import { generateText, Output } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const result = await generateText({
  model: __MODEL__, // must be a reasoning model
  output: Output.object({
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
          }),
        ),
        steps: z.array(z.string()),
      }),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});

console.log(result.reasoning);
```

