## Reranking Models

You can create models that call the [Cohere rerank API](https://docs.cohere.com/v2/reference/rerank)
using the `.reranking()` factory method.

```ts
const model = cohere.reranking('rerank-v3.5');
```

You can use Cohere reranking models to rerank documents with the `rerank` function:

```ts
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const documents = [
  'sunny day at the beach',
  'rainy afternoon in the city',
  'snowy night in the mountains',
];

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'talk about rain',
  topN: 2,
});

console.log(ranking);
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon in the city' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day at the beach' }
// ]
```

Cohere reranking models support additional provider options that can be passed via `providerOptions.cohere`:

```ts
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  providerOptions: {
    cohere: {
      maxTokensPerDoc: 1000,
      priority: 1,
    },
  },
});
```

The following provider options are available:

- **maxTokensPerDoc** _number_

  Maximum number of tokens per document. Default is `4096`.

- **priority** _number_

  Priority of the request. Default is `0`.

### Model Capabilities

| Model                      |
| -------------------------- |
| `rerank-v3.5`              |
| `rerank-english-v3.0`      |
| `rerank-multilingual-v3.0` |

---
title: Fireworks
description: Learn how to use Fireworks models with the AI SDK.
---

