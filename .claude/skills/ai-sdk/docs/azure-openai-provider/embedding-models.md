## Embedding Models

You can create models that call the Azure OpenAI embeddings API
using the `.embedding()` factory method.

```ts
const model = azure.embedding('your-embedding-deployment');
```

Azure OpenAI embedding models support several additional settings.
You can pass them as an options argument:

```ts
import { azure } from '@ai-sdk/azure';
import { embed } from 'ai';

const { embedding } = await embed({
  model: azure.embedding('your-embedding-deployment'),
  value: 'sunny day at the beach',
  providerOptions: {
    openai: {
      dimensions: 512, // optional, number of dimensions for the embedding
      user: 'test-user', // optional unique user identifier
    },
  },
});
```

The following optional provider options are available for Azure OpenAI embedding models:

- **dimensions**: _number_

  The number of dimensions the resulting output embeddings should have.
  Only supported in text-embedding-3 and later models.

- **user** _string_

  A unique identifier representing your end-user, which can help OpenAI to
  monitor and detect abuse. Learn more.

