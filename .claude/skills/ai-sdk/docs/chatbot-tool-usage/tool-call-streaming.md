## Tool call streaming

Tool call streaming is **enabled by default** in AI SDK 5.0, allowing you to stream tool calls while they are being generated. This provides a better user experience by showing tool inputs as they are generated in real-time.

```tsx filename='app/api/chat/route.ts'
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: __MODEL__,
    messages: await convertToModelMessages(messages),
    // toolCallStreaming is enabled by default in v5
    // ...
  });

  return result.toUIMessageStreamResponse();
}
```

With tool call streaming enabled, partial tool calls are streamed as part of the data stream.
They are available through the `useChat` hook.
The typed tool parts of assistant messages will also contain partial tool calls.
You can use the `state` property of the tool part to render the correct UI.

```tsx filename='app/page.tsx' highlight="9,10"
export default function Chat() {
  // ...
  return (
    <>
      {messages?.map(message => (
        <div key={message.id}>
          {message.parts.map(part => {
            switch (part.type) {
              case 'tool-askForConfirmation':
              case 'tool-getLocation':
              case 'tool-getWeatherInformation':
                switch (part.state) {
                  case 'input-streaming':
                    return <pre>{JSON.stringify(part.input, null, 2)}</pre>;
                  case 'input-available':
                    return <pre>{JSON.stringify(part.input, null, 2)}</pre>;
                  case 'output-available':
                    return <pre>{JSON.stringify(part.output, null, 2)}</pre>;
                  case 'output-error':
                    return <div>Error: {part.errorText}</div>;
                }
            }
          })}
        </div>
      ))}
    </>
  );
}
```

