## Embedding Models

You can create models that call the [OpenAI embeddings API](https://platform.openai.com/docs/api-reference/embeddings)
using the `.embedding()` factory method.

```ts
const model = openai.embedding('text-embedding-3-large');
```

OpenAI embedding models support several additional provider options.
You can pass them as an options argument:

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-large'),
  value: 'sunny day at the beach',
  providerOptions: {
    openai: {
      dimensions: 512, // optional, number of dimensions for the embedding
      user: 'test-user', // optional unique user identifier
    },
  },
});
```

The following optional provider options are available for OpenAI embedding models:

- **dimensions**: _number_

  The number of dimensions the resulting output embeddings should have.
  Only supported in text-embedding-3 and later models.

- **user** _string_

  A unique identifier representing your end-user, which can help OpenAI to
  monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).

### Model Capabilities

| Model                    | Default Dimensions | Custom Dimensions   |
| ------------------------ | ------------------ | ------------------- |
| `text-embedding-3-large` | 3072               | <Check size={18} /> |
| `text-embedding-3-small` | 1536               | <Check size={18} /> |
| `text-embedding-ada-002` | 1536               | <Cross size={18} /> |

