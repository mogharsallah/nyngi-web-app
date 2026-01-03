## Implementing AI Logic

The core of our application is the `generateResponse` function in `lib/generate-response.ts`, which processes messages and generates responses using the AI SDK.

Here's how to implement it:

```typescript filename="lib/generate-response.ts"
import { generateText, ModelMessage } from 'ai';
__PROVIDER_IMPORT__;

export const generateResponse = async (
  messages: ModelMessage[],
  updateStatus?: (status: string) => void,
) => {
  const { text } = await generateText({
    model: __MODEL__,
    system: `You are a Slack bot assistant. Keep your responses concise and to the point.
    - Do not tag users.
    - Current date is: ${new Date().toISOString().split('T')[0]}`,
    messages,
  });

  // Convert markdown to Slack mrkdwn format
  return text.replace(/\[(.*?)\]\((.*?)\)/g, '<$2|$1>').replace(/\*\*/g, '*');
};
```

This basic implementation:

1. Uses the AI SDK's `generateText` function to call Anthropic's `claude-sonnet-4.5` model
2. Provides a system prompt to guide the model's behavior
3. Formats the response for Slack's markdown format

