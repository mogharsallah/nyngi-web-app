## Settings

### Top-N Results

Use `topN` to limit the number of results returned. This is useful for retrieving only the most relevant documents:

```ts highlight={"7"}
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['doc1', 'doc2', 'doc3', 'doc4', 'doc5'],
  query: 'relevant information',
  topN: 3, // Return only top 3 most relevant documents
});
```

### Provider Options

Reranking model settings can be configured using `providerOptions` for provider-specific parameters:

```ts highlight={"8-12"}
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  providerOptions: {
    cohere: {
      maxTokensPerDoc: 1000, // Limit tokens per document
    },
  },
});
```

### Retries

The `rerank` function accepts an optional `maxRetries` parameter of type `number`
that you can use to set the maximum number of retries for the reranking process.
It defaults to `2` retries (3 attempts in total). You can set it to `0` to disable retries.

```ts highlight={"7"}
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  maxRetries: 0, // Disable retries
});
```

### Abort Signals and Timeouts

The `rerank` function accepts an optional `abortSignal` parameter of
type [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
that you can use to abort the reranking process or set a timeout.

```ts highlight={"7"}
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  abortSignal: AbortSignal.timeout(5000), // Abort after 5 seconds
});
```

### Custom Headers

The `rerank` function accepts an optional `headers` parameter of type `Record<string, string>`
that you can use to add custom headers to the reranking request.

```ts highlight={"7"}
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  headers: { 'X-Custom-Header': 'custom-value' },
});
```

