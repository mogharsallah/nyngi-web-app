## Understanding the Results

The `rerank` function returns a comprehensive result object:

```ts
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking, rerankedDocuments, originalDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
});

// ranking: sorted array of { originalIndex, score, document }
// rerankedDocuments: documents sorted by relevance (convenience property)
// originalDocuments: original documents array
```

Each item in the `ranking` array contains:

- `originalIndex`: Position in the original documents array
- `score`: Relevance score (typically 0-1, where higher is more relevant)
- `document`: The original document

