## Debugging

### Inspecting Warnings

Not all providers support all AI SDK features.
Providers either throw exceptions or return warnings when they do not support a feature.
To check if your prompt, tools, and settings are handled correctly by the provider, you can check the call warnings:

```ts
const result = await generateText({
  model: __MODEL__,
  prompt: 'Hello, world!',
});

console.log(result.warnings);
```

### HTTP Request Bodies

You can inspect the raw HTTP request bodies for models that expose them, e.g. [OpenAI](/providers/ai-sdk-providers/openai).
This allows you to inspect the exact payload that is sent to the model provider in the provider-specific way.

Request bodies are available via the `request.body` property of the response:

```ts highlight="6"
const result = await generateText({
  model: __MODEL__,
  prompt: 'Hello, world!',
});

console.log(result.request.body);
```

---
title: Settings
description: Learn how to configure the AI SDK.
---

