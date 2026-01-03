## Reranking Models

You can create Together.ai reranking models using the `.reranking()` factory method.
For more on reranking with the AI SDK see [rerank()](/docs/reference/ai-sdk-core/rerank).

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { rerank } from 'ai';

const documents = [
  'sunny day at the beach',
  'rainy afternoon in the city',
  'snowy night in the mountains',
];

const { ranking } = await rerank({
  model: togetherai.reranking('Salesforce/Llama-Rank-v1'),
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

Together.ai reranking models support additional provider options for object documents. You can specify which fields to use for ranking:

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { rerank } from 'ai';

const documents = [
  {
    from: 'Paul Doe',
    subject: 'Follow-up',
    text: 'We are happy to give you a discount of 20%.',
  },
  {
    from: 'John McGill',
    subject: 'Missing Info',
    text: 'Here is the pricing from Oracle: $5000/month',
  },
];

const { ranking } = await rerank({
  model: togetherai.reranking('Salesforce/Llama-Rank-v1'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  providerOptions: {
    togetherai: {
      rankFields: ['from', 'subject', 'text'], // Specify which fields to rank by
    },
  },
});
```

The following provider options are available:

- **rankFields** _string[]_

  Array of field names to use for ranking when documents are JSON objects. If not specified, all fields are used.

### Model Capabilities

| Model                                 |
| ------------------------------------- |
| `Salesforce/Llama-Rank-v1`            |
| `mixedbread-ai/Mxbai-Rerank-Large-V2` |

---
title: Cohere
description: Learn how to use the Cohere provider for the AI SDK.
---

