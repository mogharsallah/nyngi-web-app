## Using with createAgentUIStreamResponse

Pass call options through API routes to your agent:

```ts filename="app/api/chat/route.ts"
import { createAgentUIStreamResponse } from 'ai';
import { myAgent } from '@/ai/agents/my-agent';

export async function POST(request: Request) {
  const { messages, userId, accountType } = await request.json();

  return createAgentUIStreamResponse({
    agent: myAgent,
    messages,
    options: {
      userId,
      accountType,
    },
  });
}
```

