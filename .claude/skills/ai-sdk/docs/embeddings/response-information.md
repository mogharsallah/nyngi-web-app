## Response Information

Both `embed` and `embedMany` return response information that includes the raw provider response:

```ts highlight={"4,9"}
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const { embedding, response } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});

console.log(response); // Raw provider response
```

