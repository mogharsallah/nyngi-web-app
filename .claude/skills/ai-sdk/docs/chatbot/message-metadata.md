## Message Metadata

You can attach custom metadata to messages for tracking information like timestamps, model details, and token usage.

```ts
// Server: Send metadata about the message
return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === 'start') {
      return {
        createdAt: Date.now(),
        model: 'gpt-5.1',
      };
    }

    if (part.type === 'finish') {
      return {
        totalTokens: part.totalUsage.totalTokens,
      };
    }
  },
});
```

```tsx
// Client: Access metadata via message.metadata
{
  messages.map(message => (
    <div key={message.id}>
      {message.role}:{' '}
      {message.metadata?.createdAt &&
        new Date(message.metadata.createdAt).toLocaleTimeString()}
      {/* Render message content */}
      {message.parts.map((part, index) =>
        part.type === 'text' ? <span key={index}>{part.text}</span> : null,
      )}
      {/* Show token count if available */}
      {message.metadata?.totalTokens && (
        <span>{message.metadata.totalTokens} tokens</span>
      )}
    </div>
  ));
}
```

For complete examples with type safety and advanced use cases, see the [Message Metadata documentation](/docs/ai-sdk-ui/message-metadata).

