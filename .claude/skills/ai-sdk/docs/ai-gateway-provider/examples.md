## Examples

### Basic Text Generation

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Write a haiku about programming',
});

console.log(text);
```

### Streaming

```ts
import { streamText } from 'ai';

const { textStream } = await streamText({
  model: 'openai/gpt-5',
  prompt: 'Explain the benefits of serverless architecture',
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

### Tool Usage

```ts
import { generateText, tool } from 'ai';
import { z } from 'zod';

const { text } = await generateText({
  model: 'xai/grok-4',
  prompt: 'What is the weather like in San Francisco?',
  tools: {
    getWeather: tool({
      description: 'Get the current weather for a location',
      parameters: z.object({
        location: z.string().describe('The location to get weather for'),
      }),
      execute: async ({ location }) => {
        // Your weather API call here
        return `It's sunny in ${location}`;
      },
    }),
  },
});
```

### Provider-Executed Tools

Some providers offer tools that are executed by the provider itself, such as [OpenAI's web search tool](/providers/ai-sdk-providers/openai#web-search-tool). To use these tools through AI Gateway, import the provider to access the tool definitions:

```ts
import { generateText, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateText({
  model: 'openai/gpt-5-mini',
  prompt: 'What is the Vercel AI Gateway?',
  stopWhen: stepCountIs(10),
  tools: {
    web_search: openai.tools.webSearch({}),
  },
});

console.dir(result.text);
```

<Note>
  Some provider-executed tools require account-specific configuration (such as
  Claude Agent Skills) and may not work through AI Gateway. To use these tools,
  you must bring your own key (BYOK) directly to the provider.
</Note>

### Usage Tracking with User and Tags

Track usage per end-user and categorize requests with tags:

```ts
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Summarize this document...',
  providerOptions: {
    gateway: {
      user: 'user-abc-123', // Track usage for this specific end-user
      tags: ['document-summary', 'premium-feature'], // Categorize for reporting
    } satisfies GatewayProviderOptions,
  },
});
```

This allows you to:

- View usage and costs broken down by end-user in your analytics
- Filter and analyze spending by feature or use case using tags
- Track which users or features are driving the most AI usage

