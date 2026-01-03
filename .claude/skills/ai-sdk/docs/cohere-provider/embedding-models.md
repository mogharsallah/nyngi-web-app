## Embedding Models

You can create models that call the [Cohere embed API](https://docs.cohere.com/v2/reference/embed)
using the `.embedding()` factory method.

```ts
const model = cohere.embedding('embed-english-v3.0');
```

You can use Cohere embedding models to generate embeddings with the `embed` function:

```ts
import { cohere } from '@ai-sdk/cohere';
import { embed } from 'ai';

const { embedding } = await embed({
  model: cohere.embedding('embed-english-v3.0'),
  value: 'sunny day at the beach',
  providerOptions: {
    cohere: {
      inputType: 'search_document',
    },
  },
});
```

Cohere embedding models support additional provider options that can be passed via `providerOptions.cohere`:

```ts
import { cohere } from '@ai-sdk/cohere';
import { embed } from 'ai';

const { embedding } = await embed({
  model: cohere.embedding('embed-english-v3.0'),
  value: 'sunny day at the beach',
  providerOptions: {
    cohere: {
      inputType: 'search_document',
      truncate: 'END',
    },
  },
});
```

The following provider options are available:

- **inputType** _'search_document' | 'search_query' | 'classification' | 'clustering'_

  Specifies the type of input passed to the model. Default is `search_query`.

  - `search_document`: Used for embeddings stored in a vector database for search use-cases.
  - `search_query`: Used for embeddings of search queries run against a vector DB to find relevant documents.
  - `classification`: Used for embeddings passed through a text classifier.
  - `clustering`: Used for embeddings run through a clustering algorithm.

- **truncate** _'NONE' | 'START' | 'END'_

  Specifies how the API will handle inputs longer than the maximum token length.
  Default is `END`.

  - `NONE`: If selected, when the input exceeds the maximum input token length will return an error.
  - `START`: Will discard the start of the input until the remaining input is exactly the maximum input token length for the model.
  - `END`: Will discard the end of the input until the remaining input is exactly the maximum input token length for the model.

### Model Capabilities

| Model                           | Embedding Dimensions |
| ------------------------------- | -------------------- |
| `embed-english-v3.0`            | 1024                 |
| `embed-multilingual-v3.0`       | 1024                 |
| `embed-english-light-v3.0`      | 384                  |
| `embed-multilingual-light-v3.0` | 384                  |
| `embed-english-v2.0`            | 4096                 |
| `embed-english-light-v2.0`      | 1024                 |
| `embed-multilingual-v2.0`       | 768                  |

