## Output Types

The AI SDK supports multiple ways of specifying the expected structure of generated data via the `Output` object. You can select from various strategies for structured/text generation and validation.

### `Output.text()`

Use `Output.text()` to generate plain text from a model. This option doesn't enforce any schema on the result: you simply receive the model's text as a string. This is the default behavior when no `output` is specified.

```ts
import { generateText, Output } from 'ai';

const { output } = await generateText({
  // ...
  output: Output.text(),
  prompt: 'Tell me a joke.',
});
// output will be a string (the joke)
```

### `Output.object()`

Use `Output.object({ schema })` to generate a structured object based on a schema (for example, a Zod schema). The output is type-validated to ensure the returned result matches the schema.

```ts
import { generateText, Output } from 'ai';
import { z } from 'zod';

const { output } = await generateText({
  // ...
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable(),
      labels: z.array(z.string()),
    }),
  }),
  prompt: 'Generate information for a test user.',
});
// output will be an object matching the schema above
```

<Note>
  Partial outputs streamed via `streamText` cannot be validated against your
  provided schema, as incomplete data may not yet conform to the expected
  structure.
</Note>

### `Output.array()`

Use `Output.array({ element })` to specify that you expect an array of typed objects from the model, where each element should conform to a schema (defined in the `element` property).

```ts
import { generateText, Output } from 'ai';
import { z } from 'zod';

const { output } = await generateText({
  // ...
  output: Output.array({
    element: z.object({
      location: z.string(),
      temperature: z.number(),
      condition: z.string(),
    }),
  }),
  prompt: 'List the weather for San Francisco and Paris.',
});
// output will be an array of objects like:
// [
//   { location: 'San Francisco', temperature: 70, condition: 'Sunny' },
//   { location: 'Paris', temperature: 65, condition: 'Cloudy' },
// ]
```

### `Output.choice()`

Use `Output.choice({ options })` when you expect the model to choose from a specific set of string options, such as for classification or fixed-enum answers.

```ts
import { generateText, Output } from 'ai';

const { output } = await generateText({
  // ...
  output: Output.choice({
    options: ['sunny', 'rainy', 'snowy'],
  }),
  prompt: 'Is the weather sunny, rainy, or snowy today?',
});
// output will be one of: 'sunny', 'rainy', or 'snowy'
```

You can provide any set of string options, and the output will always be a single string value that matches one of the specified options. The AI SDK validates that the result matches one of your options, and will throw if the model returns something invalid.

This is especially useful for making classification-style generations or forcing valid values for API compatibility.

### `Output.json()`

Use `Output.json()` when you want to generate and parse unstructured JSON values from the model, without enforcing a specific schema. This is useful if you want to capture arbitrary objects, flexible structures, or when you want to rely on the model's natural output rather than rigid validation.

```ts
import { generateText, Output } from 'ai';

const { output } = await generateText({
  // ...
  output: Output.json(),
  prompt:
    'For each city, return the current temperature and weather condition as a JSON object.',
});

// output could be any valid JSON, for example:
// {
//   "San Francisco": { "temperature": 70, "condition": "Sunny" },
//   "Paris": { "temperature": 65, "condition": "Cloudy" }
// }
```

With `Output.json`, the AI SDK only checks that the response is valid JSON; it doesn't validate the structure or types of the values. If you need schema validation, use the `.object` or `.array` outputs instead.

For more advanced validation or different structures, see [the Output API reference](/docs/reference/ai-sdk-core/output).

