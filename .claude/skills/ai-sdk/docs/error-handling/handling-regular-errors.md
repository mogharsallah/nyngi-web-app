## Handling regular errors

Regular errors are thrown and can be handled using the `try/catch` block.

```ts highlight="3,8-10"
import { generateText } from 'ai';
__PROVIDER_IMPORT__;

try {
  const { text } = await generateText({
    model: __MODEL__,
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
} catch (error) {
  // handle error
}
```

See [Error Types](/docs/reference/ai-sdk-errors) for more information on the different types of errors that may be thrown.

