## Embedding Models

You can create Together.ai embedding models using the `.embedding()` factory method.
For more on embedding models with the AI SDK see [embed()](/docs/reference/ai-sdk-core/embed).

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { embed } from 'ai';

const { embedding } = await embed({
  model: togetherai.embedding('togethercomputer/m2-bert-80M-2k-retrieval'),
  value: 'sunny day at the beach',
});
```

### Model Capabilities

| Model                                            | Dimensions | Max Tokens |
| ------------------------------------------------ | ---------- | ---------- |
| `togethercomputer/m2-bert-80M-2k-retrieval`      | 768        | 2048       |
| `togethercomputer/m2-bert-80M-8k-retrieval`      | 768        | 8192       |
| `togethercomputer/m2-bert-80M-32k-retrieval`     | 768        | 32768      |
| `WhereIsAI/UAE-Large-V1`                         | 1024       | 512        |
| `BAAI/bge-large-en-v1.5`                         | 1024       | 512        |
| `BAAI/bge-base-en-v1.5`                          | 768        | 512        |
| `sentence-transformers/msmarco-bert-base-dot-v5` | 768        | 512        |
| `bert-base-uncased`                              | 768        | 512        |

<Note>
  For a complete list of available embedding models, see the [Together.ai models
  page](https://docs.together.ai/docs/serverless-models#embedding-models).
</Note>

