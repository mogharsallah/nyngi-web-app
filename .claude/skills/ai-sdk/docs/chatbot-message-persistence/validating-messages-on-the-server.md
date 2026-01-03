## Validating messages on the server

When processing messages on the server that contain tool calls, custom metadata, or data parts, you should validate them using `validateUIMessages` before sending them to the model.

### Validation with tools

When your messages include tool calls, validate them against your tool definitions:

```tsx filename="app/api/chat/route.ts" highlight="7-25,32-37"
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  validateUIMessages,
  tool,
} from 'ai';
import { z } from 'zod';
import { loadChat, saveChat } from '@util/chat-store';
import { openai } from '@ai-sdk/openai';
import { dataPartsSchema, metadataSchema } from '@util/schemas';

// Define your tools
const tools = {
  weather: tool({
    description: 'Get weather information',
    parameters: z.object({
      location: z.string(),
      units: z.enum(['celsius', 'fahrenheit']),
    }),
    execute: async ({ location, units }) => {
      /* tool implementation */
    },
  }),
  // other tools
};

export async function POST(req: Request) {
  const { message, id } = await req.json();

  // Load previous messages from database
  const previousMessages = await loadChat(id);

  // Append new message to previousMessages messages
  const messages = [...previousMessages, message];

  // Validate loaded messages against
  // tools, data parts schema, and metadata schema
  const validatedMessages = await validateUIMessages({
    messages,
    tools, // Ensures tool calls in messages match current schemas
    dataPartsSchema,
    metadataSchema,
  });

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(validatedMessages),
    tools,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
```

### Handling validation errors

Handle validation errors gracefully when messages from the database don't match current schemas:

```tsx filename="app/api/chat/route.ts" highlight="3,10-24"
import {
  convertToModelMessages,
  streamText,
  validateUIMessages,
  TypeValidationError,
} from 'ai';
import { type MyUIMessage } from '@/types';

export async function POST(req: Request) {
  const { message, id } = await req.json();

  // Load and validate messages from database
  let validatedMessages: MyUIMessage[];

  try {
    const previousMessages = await loadMessagesFromDB(id);
    validatedMessages = await validateUIMessages({
      // append the new message to the previous messages:
      messages: [...previousMessages, message],
      tools,
      metadataSchema,
    });
  } catch (error) {
    if (error instanceof TypeValidationError) {
      // Log validation error for monitoring
      console.error('Database messages validation failed:', error);
      // Could implement message migration or filtering here
      // For now, start with empty history
      validatedMessages = [];
    } else {
      throw error;
    }
  }

  // Continue with validated messages...
}
```

