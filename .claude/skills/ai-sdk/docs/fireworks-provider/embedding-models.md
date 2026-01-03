## Embedding Models

You can create models that call the Fireworks embeddings API using the `.embedding()` factory method:

```ts
const model = fireworks.embedding('nomic-ai/nomic-embed-text-v1.5');
```

You can use Fireworks embedding models to generate embeddings with the `embed` function:

```ts
import { fireworks } from '@ai-sdk/fireworks';
import { embed } from 'ai';

const { embedding } = await embed({
  model: fireworks.embedding('nomic-ai/nomic-embed-text-v1.5'),
  value: 'sunny day at the beach',
});
```

### Model Capabilities

| Model                            | Dimensions | Max Tokens |
| -------------------------------- | ---------- | ---------- |
| `nomic-ai/nomic-embed-text-v1.5` | 768        | 8192       |

<Note>
  For more embedding models, see the [Fireworks models
  page](https://fireworks.ai/models) for a full list of available models.
</Note>

