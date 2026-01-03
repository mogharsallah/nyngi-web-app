## Using an Agent

Once defined, you can use your agent in three ways:

### Generate Text

Use `generate()` for one-time text generation:

```ts
const result = await myAgent.generate({
  prompt: 'What is the weather like?',
});

console.log(result.text);
```

### Stream Text

Use `stream()` for streaming responses:

```ts
const stream = myAgent.stream({
  prompt: 'Tell me a story',
});

for await (const chunk of stream.textStream) {
  console.log(chunk);
}
```

### Respond to UI Messages

Use `createAgentUIStreamResponse()` to create API responses for client applications:

```ts
// In your API route (e.g., app/api/chat/route.ts)
import { createAgentUIStreamResponse } from 'ai';

export async function POST(request: Request) {
  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: myAgent,
    messages,
  });
}
```

