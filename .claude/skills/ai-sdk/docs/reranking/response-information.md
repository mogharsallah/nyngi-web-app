## Response Information

The `rerank` function returns response information that includes the raw provider response:

```ts highlight={"4,10"}
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking, response } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
});

console.log(response); // { id, timestamp, modelId, headers, body }
```

