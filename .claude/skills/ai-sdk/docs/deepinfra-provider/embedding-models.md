## Embedding Models

You can create DeepInfra embedding models using the `.embedding()` factory method.
For more on embedding models with the AI SDK see [embed()](/docs/reference/ai-sdk-core/embed).

```ts
import { deepinfra } from '@ai-sdk/deepinfra';
import { embed } from 'ai';

const { embedding } = await embed({
  model: deepinfra.embedding('BAAI/bge-large-en-v1.5'),
  value: 'sunny day at the beach',
});
```

### Model Capabilities

| Model                                                 | Dimensions | Max Tokens |
| ----------------------------------------------------- | ---------- | ---------- |
| `BAAI/bge-base-en-v1.5`                               | 768        | 512        |
| `BAAI/bge-large-en-v1.5`                              | 1024       | 512        |
| `BAAI/bge-m3`                                         | 1024       | 8192       |
| `intfloat/e5-base-v2`                                 | 768        | 512        |
| `intfloat/e5-large-v2`                                | 1024       | 512        |
| `intfloat/multilingual-e5-large`                      | 1024       | 512        |
| `sentence-transformers/all-MiniLM-L12-v2`             | 384        | 256        |
| `sentence-transformers/all-MiniLM-L6-v2`              | 384        | 256        |
| `sentence-transformers/all-mpnet-base-v2`             | 768        | 384        |
| `sentence-transformers/clip-ViT-B-32`                 | 512        | 77         |
| `sentence-transformers/clip-ViT-B-32-multilingual-v1` | 512        | 77         |
| `sentence-transformers/multi-qa-mpnet-base-dot-v1`    | 768        | 512        |
| `sentence-transformers/paraphrase-MiniLM-L6-v2`       | 384        | 128        |
| `shibing624/text2vec-base-chinese`                    | 768        | 512        |
| `thenlper/gte-base`                                   | 768        | 512        |
| `thenlper/gte-large`                                  | 1024       | 512        |

<Note>
  For a complete list of available embedding models, see the [DeepInfra
  embeddings page](https://deepinfra.com/models/embeddings).
</Note>

---
title: Deepgram
description: Learn how to use the Deepgram provider for the AI SDK.
---

