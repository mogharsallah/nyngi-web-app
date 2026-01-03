## Using Persistence

With the Responses API, you can persist chat history with OpenAI across requests. This allows you to send just the user's last message and OpenAI can access the entire chat history.

There are two options available to use persistence:

### With previousResponseId

```tsx filename="app/api/chat/route.ts"
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result1 = await generateText({
  model: openai.responses('gpt-4o-mini'),
  prompt: 'Invent a new holiday and describe its traditions.',
});

const result2 = await generateText({
  model: openai.responses('gpt-4o-mini'),
  prompt: 'Summarize in 2 sentences',
  providerOptions: {
    openai: {
      previousResponseId: result1.providerMetadata?.openai.responseId as string,
    },
  },
});
```

### With Conversations

You can use the [Conversation API](https://platform.openai.com/docs/api-reference/conversations/create) to create a conversation.

Once you have created a conversation, you can continue it:

```tsx filename="app/api/chat/route.ts"
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const result = await generateText({
  model: openai.responses('gpt-4o-mini'),
  prompt: 'Summarize in 2 sentences',
  providerOptions: {
    openai: {
      // The Conversation ID created via the OpenAI API to continue
      conversation: 'conv_123',
    },
  },
});
```

