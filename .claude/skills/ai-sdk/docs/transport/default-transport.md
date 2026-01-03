## Default Transport

By default, `useChat` uses HTTP POST requests to send messages to `/api/chat`:

```tsx
import { useChat } from '@ai-sdk/react';

// Uses default HTTP transport
const { messages, sendMessage } = useChat();
```

This is equivalent to:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});
```

