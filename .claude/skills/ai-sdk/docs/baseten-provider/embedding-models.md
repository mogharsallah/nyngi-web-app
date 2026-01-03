## Embedding Models

You can create models that call the Baseten embeddings API using the `.embeddingModel()` factory method. The Baseten provider uses the high-performance `@basetenlabs/performance-client` for optimal embedding performance.

<Note>
  **Important:** Embedding models require a dedicated deployment with a custom
  `modelURL`. Unlike chat models, embeddings cannot use Baseten's default Model
  APIs and must specify a dedicated model endpoint.
</Note>

```ts
import { createBaseten } from '@ai-sdk/baseten';
import { embed, embedMany } from 'ai';

const baseten = createBaseten({
  modelURL: 'https://model-{MODEL_ID}.api.baseten.co/sync',
});

const embeddingModel = baseten.embeddingModel();

// Single embedding
const { embedding } = await embed({
  model: embeddingModel,
  value: 'sunny day at the beach',
});

// Batch embeddings
const { embeddings } = await embedMany({
  model: embeddingModel,
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy mountain peak',
  ],
});
```

### Endpoint Support for Embeddings

**Supported:**

- `/sync` endpoints (Performance Client automatically adds `/v1/embeddings`)
- `/sync/v1` endpoints (automatically strips `/v1` before passing to Performance Client)

**Not Supported:**

- `/predict` endpoints (not compatible with Performance Client)

### Performance Features

The embedding implementation includes:

- **High-performance client**: Uses `@basetenlabs/performance-client` for optimal performance
- **Automatic batching**: Efficiently handles multiple texts in a single request
- **Connection reuse**: Performance Client is created once and reused for all requests
- **Built-in retries**: Automatic retry logic for failed requests

