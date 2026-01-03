## Stream Structured Outputs

Given the added complexity of returning structured data, model response time can be unacceptable for your interactive use case.
With `streamText` and `output`, you can stream the model's structured response as it is generated.

```ts
import { streamText, Output } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const { partialOutputStream } = streamText({
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

// use partialOutputStream as an async iterable
for await (const partialObject of partialOutputStream) {
  console.log(partialObject);
}
```

You can consume the structured output on the client with the [`useObject`](/docs/reference/ai-sdk-ui/use-object) hook.

### Error Handling in Streams

`streamText` starts streaming immediately. When errors occur during streaming, they become part of the stream rather than thrown exceptions (to prevent stream crashes).

To handle errors, provide an `onError` callback:

```tsx highlight="5-7"
import { streamText, Output } from 'ai';

const result = streamText({
  // ...
  output: Output.object({ schema }),
  onError({ error }) {
    console.error(error); // log to your error tracking service
  },
});
```

For non-streaming error handling with `generateText`, see the [Error Handling](#error-handling) section below.

