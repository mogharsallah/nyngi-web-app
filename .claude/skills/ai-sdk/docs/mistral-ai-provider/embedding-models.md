## Embedding Models

You can create models that call the [Mistral embeddings API](https://docs.mistral.ai/api/#operation/createEmbedding)
using the `.embedding()` factory method.

```ts
const model = mistral.embedding('mistral-embed');
```

You can use Mistral embedding models to generate embeddings with the `embed` function:

```ts
import { mistral } from '@ai-sdk/mistral';
import { embed } from 'ai';

const { embedding } = await embed({
  model: mistral.embedding('mistral-embed'),
  value: 'sunny day at the beach',
});
```

### Model Capabilities

| Model           | Default Dimensions |
| --------------- | ------------------ |
| `mistral-embed` | 1024               |

---
title: Together.ai
description: Learn how to use Together.ai's models with the AI SDK.
---

