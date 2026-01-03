## Basic Usage

```tsx
import { readUIMessageStream, streamText } from 'ai';
__PROVIDER_IMPORT__;

async function main() {
  const result = streamText({
    model: __MODEL__,
    prompt: 'Write a short story about a robot.',
  });

  for await (const uiMessage of readUIMessageStream({
    stream: result.toUIMessageStream(),
  })) {
    console.log('Current message state:', uiMessage);
  }
}
```

