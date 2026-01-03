## Storing messages

`useChat` sends the chat id and the messages to the backend.

<Note>
  The `useChat` message format is different from the `ModelMessage` format. The
  `useChat` message format is designed for frontend display, and contains
  additional fields such as `id` and `createdAt`. We recommend storing the
  messages in the `useChat` message format.

When loading messages from storage that contain tools, metadata, or custom data
parts, validate them using `validateUIMessages` before processing (see the
[validation section](#validating-messages-from-database) above).

</Note>

Storing messages is done in the `onFinish` callback of the `toUIMessageStreamResponse` function.
`onFinish` receives the complete messages including the new AI response as `UIMessage[]`.

```tsx filename="app/api/chat/route.ts" highlight="6,11-17"
import { openai } from '@ai-sdk/openai';
import { saveChat } from '@util/chat-store';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } =
    await req.json();

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

The actual storage of the messages is done in the `saveChat` function, which in
our file-based chat store is implemented as follows:

```tsx filename="util/chat-store.ts"
import { UIMessage } from 'ai';
import { writeFile } from 'fs/promises';

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(chatId), content);
}

// ... rest of the file
```

