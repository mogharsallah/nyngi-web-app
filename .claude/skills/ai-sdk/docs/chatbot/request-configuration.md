## Request Configuration

### Custom headers, body, and credentials

By default, the `useChat` hook sends a HTTP POST request to the `/api/chat` endpoint with the message list as the request body. You can customize the request in two ways:

#### Hook-Level Configuration (Applied to all requests)

You can configure transport-level options that will be applied to all requests made by the hook:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: {
      Authorization: 'your_token',
    },
    body: {
      user_id: '123',
    },
    credentials: 'same-origin',
  }),
});
```

#### Dynamic Hook-Level Configuration

You can also provide functions that return configuration values. This is useful for authentication tokens that need to be refreshed, or for configuration that depends on runtime conditions:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: () => ({
      Authorization: `Bearer ${getAuthToken()}`,
      'X-User-ID': getCurrentUserId(),
    }),
    body: () => ({
      sessionId: getCurrentSessionId(),
      preferences: getUserPreferences(),
    }),
    credentials: () => 'include',
  }),
});
```

<Note>
  For component state that changes over time, use `useRef` to store the current
  value and reference `ref.current` in your configuration function, or prefer
  request-level options (see next section) for better reliability.
</Note>

#### Request-Level Configuration (Recommended)

<Note>
  **Recommended**: Use request-level options for better flexibility and control.
  Request-level options take precedence over hook-level options and allow you to
  customize each request individually.
</Note>

```tsx
// Pass options as the second parameter to sendMessage
sendMessage(
  { text: input },
  {
    headers: {
      Authorization: 'Bearer token123',
      'X-Custom-Header': 'custom-value',
    },
    body: {
      temperature: 0.7,
      max_tokens: 100,
      user_id: '123',
    },
    metadata: {
      userId: 'user123',
      sessionId: 'session456',
    },
  },
);
```

The request-level options are merged with hook-level options, with request-level options taking precedence. On your server side, you can handle the request with this additional information.

### Setting custom body fields per request

You can configure custom `body` fields on a per-request basis using the second parameter of the `sendMessage` function.
This is useful if you want to pass in additional information to your backend that is not part of the message list.

```tsx filename="app/page.tsx" highlight="20-25"
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}:{' '}
          {m.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
          )}
        </div>
      ))}

      <form
        onSubmit={event => {
          event.preventDefault();
          if (input.trim()) {
            sendMessage(
              { text: input },
              {
                body: {
                  customKey: 'customValue',
                },
              },
            );
            setInput('');
          }
        }}
      >
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </div>
  );
}
```

You can retrieve these custom fields on your server side by destructuring the request body:

```ts filename="app/api/chat/route.ts" highlight="3,4"
export async function POST(req: Request) {
  // Extract additional information ("customKey") from the body of the request:
  const { messages, customKey }: { messages: UIMessage[]; customKey: string } =
    await req.json();
  //...
}
```

