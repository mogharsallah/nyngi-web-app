## Global Provider Configuration

The AI SDK 5 includes a global provider feature that allows you to specify a model using just a plain model ID string:

```ts
import { streamText } from 'ai';
__PROVIDER_IMPORT__;

const result = await streamText({
  model: __MODEL__, // Uses the global provider (defaults to gateway)
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

By default, the global provider is set to the Vercel AI Gateway.

### Customizing the Global Provider

You can set your own preferred global provider:

```ts filename="setup.ts"
import { openai } from '@ai-sdk/openai';

// Initialize once during startup:
globalThis.AI_SDK_DEFAULT_PROVIDER = openai;
```

```ts filename="app.ts"
import { streamText } from 'ai';

const result = await streamText({
  model: 'gpt-5.1', // Uses OpenAI provider without prefix
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

This simplifies provider usage and makes it easier to switch between providers without changing your model references throughout your codebase.

---
title: Error Handling
description: Learn how to handle errors in the AI SDK Core
---

