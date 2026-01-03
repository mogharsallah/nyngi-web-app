# Testing

Testing language models can be challenging, because they are non-deterministic
and calling them is slow and expensive.

To enable you to unit test your code that uses the AI SDK, the AI SDK Core
includes mock providers and test helpers. You can import the following helpers from `ai/test`:

- `MockEmbeddingModelV3`: A mock embedding model using the [embedding model v3 specification](https://github.com/vercel/ai/blob/main/packages/provider/src/embedding-model/v3/embedding-model-v3.ts).
- `MockLanguageModelV3`: A mock language model using the [language model v3 specification](https://github.com/vercel/ai/blob/main/packages/provider/src/language-model/v3/language-model-v3.ts).
- `mockId`: Provides an incrementing integer ID.
- `mockValues`: Iterates over an array of values with each call. Returns the last value when the array is exhausted.
- [`simulateReadableStream`](/docs/reference/ai-sdk-core/simulate-readable-stream): Simulates a readable stream with delays.

With mock providers and test helpers, you can control the output of the AI SDK
and test your code in a repeatable and deterministic way without actually calling
a language model provider.

