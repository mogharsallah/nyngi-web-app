## Potential Causes

### UI Messages

You are passing a `UIMessage[]` as messages into e.g. `streamText`.

You need to first convert them to a `ModelMessage[]` using `convertToModelMessages()`.

```typescript
import { type UIMessage, generateText, convertToModelMessages } from 'ai';

const messages: UIMessage[] = [
  /* ... */
];

const result = await generateText({
  // ...
  messages: await convertToModelMessages(messages),
});
```

