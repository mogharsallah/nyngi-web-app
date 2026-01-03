## Reranking Models

You can create models that call the [Bedrock Rerank API](https://docs.aws.amazon.com/bedrock/latest/userguide/rerank-api.html)
using the `.reranking()` factory method.

```ts
const model = bedrock.reranking('cohere.rerank-v3-5:0');
```

You can use Amazon Bedrock reranking models to rerank documents with the `rerank` function:

```ts
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { rerank } from 'ai';

const documents = [
  'sunny day at the beach',
  'rainy afternoon in the city',
  'snowy night in the mountains',
];

const { ranking } = await rerank({
  model: bedrock.reranking('cohere.rerank-v3-5:0'),
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

Amazon Bedrock reranking models support additional provider options that can be passed via `providerOptions.bedrock`:

```ts
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: bedrock.reranking('cohere.rerank-v3-5:0'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  providerOptions: {
    bedrock: {
      nextToken: 'pagination_token_here',
    },
  },
});
```

The following provider options are available:

- **nextToken** _string_

  Token for pagination of results.

- **additionalModelRequestFields** _Record&lt;string, unknown&gt;_

  Additional model-specific request fields.

### Model Capabilities

| Model                  |
| ---------------------- |
| `amazon.rerank-v1:0`   |
| `cohere.rerank-v3-5:0` |

