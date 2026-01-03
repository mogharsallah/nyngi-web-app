## Using Other Providers

With the AI SDK's unified provider interface you can easily switch to other providers that support multi-modal capabilities:

```tsx filename="app/api/chat/route.ts"
// Using Anthropic
const result = streamText({
  model: 'anthropic/claude-sonnet-4-20250514',
  messages: await convertToModelMessages(messages),
});

// Using Google
const result = streamText({
  model: 'google/gemini-2.5-flash',
  messages: await convertToModelMessages(messages),
});
```

Install the provider package (`@ai-sdk/anthropic` or `@ai-sdk/google`) and update your API keys in `.env.local`. The rest of your code remains the same.

<Note>
  Different providers may have varying file size limits and performance
  characteristics. Check the [provider
  documentation](/providers/ai-sdk-providers) for specific details.
</Note>

