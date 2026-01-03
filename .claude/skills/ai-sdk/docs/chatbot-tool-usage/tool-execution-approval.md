## Tool Execution Approval

Tool execution approval lets you require user confirmation before a server-side tool runs. Unlike [client-side tools](#example) that execute in the browser, tools with approval still execute on the server—but only after the user approves.

Use tool execution approval when you want to:

- Confirm sensitive operations (payments, deletions, external API calls)
- Let users review tool inputs before execution
- Add human oversight to automated workflows

For tools that need to run in the browser (updating UI state, accessing browser APIs), use client-side tools instead.

### Server Setup

Enable approval by setting `needsApproval` on your tool. See [Tool Execution Approval](/docs/ai-sdk-core/tools-and-tool-calling#tool-execution-approval) for configuration options including dynamic approval based on input.

```tsx filename='app/api/chat/route.ts'
import { streamText, tool } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: __MODEL__,
    messages,
    tools: {
      getWeather: tool({
        description: 'Get the weather in a location',
        inputSchema: z.object({
          city: z.string(),
        }),
        needsApproval: true,
        execute: async ({ city }) => {
          const weather = await fetchWeather(city);
          return weather;
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
```

### Client-Side Approval UI

When a tool requires approval, the tool part state is `approval-requested`. Use `addToolApprovalResponse` to approve or deny:

```tsx filename='app/page.tsx'
'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, addToolApprovalResponse } = useChat();

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.parts.map(part => {
            if (part.type === 'tool-getWeather') {
              switch (part.state) {
                case 'approval-requested':
                  return (
                    <div key={part.toolCallId}>
                      <p>Get weather for {part.input.city}?</p>
                      <button
                        onClick={() =>
                          addToolApprovalResponse({
                            id: part.approval.id,
                            approved: true,
                          })
                        }
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          addToolApprovalResponse({
                            id: part.approval.id,
                            approved: false,
                          })
                        }
                      >
                        Deny
                      </button>
                    </div>
                  );
                case 'output-available':
                  return (
                    <div key={part.toolCallId}>
                      Weather in {part.input.city}: {part.output}
                    </div>
                  );
              }
            }
            // Handle other part types...
          })}
        </div>
      ))}
    </>
  );
}
```

### Auto-Submit After Approval

<Note>
  If nothing happens after you approve a tool execution, make sure you either
  call `sendMessage` manually or configure `sendAutomaticallyWhen` on the
  `useChat` hook.
</Note>

Use `lastAssistantMessageIsCompleteWithApprovalResponses` to automatically continue the conversation after approvals:

```tsx
import { useChat } from '@ai-sdk/react';
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';

const { messages, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
});
```

