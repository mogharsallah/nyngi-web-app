## Output Name and Description

You can optionally specify a `name` and `description` for the output. These are used by some providers for additional LLM guidance, e.g. via tool or schema name.

```ts highlight="6-7"
import { generateText, Output } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const { output } = await generateText({
  model: __MODEL__,
  output: Output.object({
    name: 'Recipe',
    description: 'A recipe for a dish.',
    schema: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

This works with all output types that support structured generation:

- `Output.object({ name, description, schema })`
- `Output.array({ name, description, element })`
- `Output.choice({ name, description, options })`
- `Output.json({ name, description })`

