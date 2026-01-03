## Embedding Models

You can create models that call the Bedrock API [Bedrock API](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html)
using the `.embedding()` factory method.

```ts
const model = bedrock.embedding('amazon.titan-embed-text-v1');
```

Bedrock Titan embedding model amazon.titan-embed-text-v2:0 supports several additional settings.
You can pass them as an options argument:

```ts
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { embed } from 'ai';

const model = bedrock.embedding('amazon.titan-embed-text-v2:0');

const { embedding } = await embed({
  model,
  value: 'sunny day at the beach',
  providerOptions: {
    bedrock: {
      dimensions: 512, // optional, number of dimensions for the embedding
      normalize: true, // optional, normalize the output embeddings
    },
  },
});
```

The following optional provider options are available for Bedrock Titan embedding models:

- **dimensions**: _number_

  The number of dimensions the output embeddings should have. The following values are accepted: 1024 (default), 512, 256.

- **normalize** _boolean_

  Flag indicating whether or not to normalize the output embeddings. Defaults to true.

### Model Capabilities

| Model                          | Default Dimensions | Custom Dimensions   |
| ------------------------------ | ------------------ | ------------------- |
| `amazon.titan-embed-text-v1`   | 1536               | <Cross size={18} /> |
| `amazon.titan-embed-text-v2:0` | 1024               | <Check size={18} /> |
| `cohere.embed-english-v3`      | 1024               | <Cross size={18} /> |
| `cohere.embed-multilingual-v3` | 1024               | <Cross size={18} /> |

