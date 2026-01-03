## Enhance Your Agent with Tools

One of the key strengths of DeepSeek V3.2 is its agentic capabilities. You can extend your agent's functionality by adding tools that allow the model to perform specific actions or retrieve information.

### Update Your Route Handler

Let's add a weather tool to your agent. Update your route handler at `app/api/chat/route.ts`:

```tsx filename="app/api/chat/route.ts"
import { deepseek } from '@ai-sdk/deepseek';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: deepseek('deepseek-reasoner'),
    messages: await convertToModelMessages(messages),
    tools: {
      weather: tool({
        description: 'Get the weather in a location',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => ({
          location,
          temperature: 72,
          unit: 'fahrenheit',
        }),
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse({ sendReasoning: true });
}
```

This adds a weather tool that the model can call when needed. The `stopWhen: stepCountIs(5)` parameter allows the agent to continue executing for multiple steps (up to 5), enabling it to use tools and reason iteratively before stopping. Learn more about [loop control](/docs/agents/loop-control) to customize when and how your agent stops execution.

