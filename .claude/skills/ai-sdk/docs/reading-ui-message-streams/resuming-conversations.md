## Resuming Conversations

Resume streaming from a previous message state:

```tsx
import { readUIMessageStream, streamText } from 'ai';
__PROVIDER_IMPORT__;

async function resumeConversation(lastMessage: UIMessage) {
  const result = streamText({
    model: __MODEL__,
    messages: [
      { role: 'user', content: 'Continue our previous conversation.' },
    ],
  });

  // Resume from the last message
  for await (const uiMessage of readUIMessageStream({
    stream: result.toUIMessageStream(),
    message: lastMessage, // Resume from this message
  })) {
    console.log('Resumed message:', uiMessage);
  }
}
```

---
title: Message Metadata
description: Learn how to attach and use metadata with messages in AI SDK UI
---

