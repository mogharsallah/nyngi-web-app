## Embedding Middleware

You can enhance embedding models, e.g. to set default values, using
`wrapEmbeddingModel` and `EmbeddingModelV3Middleware`.

Here is an example that uses the built-in `defaultEmbeddingSettingsMiddleware`:

```ts
import {
  customProvider,
  defaultEmbeddingSettingsMiddleware,
  embed,
  wrapEmbeddingModel,
  gateway,
} from 'ai';

const embeddingModelWithDefaults = wrapEmbeddingModel({
  model: gateway.embeddingModel('google/gemini-embedding-001'),
  middleware: defaultEmbeddingSettingsMiddleware({
    settings: {
      providerOptions: {
        google: {
          outputDimensionality: 256,
          taskType: 'CLASSIFICATION',
        },
      },
    },
  }),
});
```

