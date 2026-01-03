## generateObject and streamObject (Legacy)

<Note type="warning">
  `generateObject` and `streamObject` are deprecated. Use `generateText` and
  `streamText` with the `output` property instead. The legacy functions will be
  removed in a future major version.
</Note>

The `generateObject` and `streamObject` functions are the legacy way to generate structured data. They work similarly to `generateText` and `streamText` with `Output.object()`, but as standalone functions.

### generateObject

```ts
import { generateObject } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const { object } = await generateObject({
  model: __MODEL__,
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

### streamObject

```ts
import { streamObject } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const { partialObjectStream } = streamObject({
  model: __MODEL__,
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});

for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

### Schema Name and Description (Legacy)

You can optionally specify a name and description for the schema. These are used by some providers for additional LLM guidance, e.g. via tool or schema name.

```ts highlight="4-5"
import { generateObject } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const { object } = await generateObject({
  model: __MODEL__,
  schemaName: 'Recipe',
  schemaDescription: 'A recipe for a dish.',
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

### Output Strategy (Legacy)

The legacy functions support different output strategies via the `output` parameter:

#### Array

Generate an array of objects. The schema specifies the shape of an array element.

```ts highlight="7"
import { streamObject } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const { elementStream } = streamObject({
  model: __MODEL__,
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z
      .string()
      .describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});

for await (const hero of elementStream) {
  console.log(hero);
}
```

#### Enum

Generate a specific enum value for classification tasks.

```ts highlight="5-6"
import { generateObject } from 'ai';
__PROVIDER_IMPORT__;

const { object } = await generateObject({
  model: __MODEL__,
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt:
    'Classify the genre of this movie plot: ' +
    '"A group of astronauts travel through a wormhole in search of a ' +
    'new habitable planet for humanity."',
});
```

#### No Schema

Generate unstructured JSON without a schema.

```ts highlight="6"
import { generateObject } from 'ai';
__PROVIDER_IMPORT__;

const { object } = await generateObject({
  model: __MODEL__,
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

### Repairing Invalid JSON (Legacy)

<Note type="warning">
  The `repairText` function is experimental and may change in the future.
</Note>

Sometimes the model will generate invalid or malformed JSON.
You can use the `repairText` function to attempt to repair the JSON.

```ts highlight="7-10"
import { generateObject } from 'ai';

const { object } = await generateObject({
  model,
  schema,
  prompt,
  experimental_repairText: async ({ text, error }) => {
    // example: add a closing brace to the text
    return text + '}';
  },
});
```

