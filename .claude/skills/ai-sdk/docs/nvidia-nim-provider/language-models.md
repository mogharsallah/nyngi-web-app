## Language Models

You can interact with NIM models using a provider instance. For example, to use [DeepSeek-R1](https://build.nvidia.com/deepseek-ai/deepseek-r1), a powerful open-source language model:

```ts
const model = nim.chatModel('deepseek-ai/deepseek-r1');
```

### Example - Generate Text

You can use NIM language models to generate text with the `generateText` function:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';

const nim = createOpenAICompatible({
  name: 'nim',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.NIM_API_KEY}`,
  },
});

const { text, usage, finishReason } = await generateText({
  model: nim.chatModel('deepseek-ai/deepseek-r1'),
  prompt: 'Tell me the history of the San Francisco Mission-style burrito.',
});

console.log(text);
console.log('Token usage:', usage);
console.log('Finish reason:', finishReason);
```

### Example - Stream Text

NIM language models can also generate text in a streaming fashion with the `streamText` function:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

const nim = createOpenAICompatible({
  name: 'nim',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.NIM_API_KEY}`,
  },
});

const result = streamText({
  model: nim.chatModel('deepseek-ai/deepseek-r1'),
  prompt: 'Tell me the history of the Northern White Rhino.',
});

for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}

console.log();
console.log('Token usage:', await result.usage);
console.log('Finish reason:', await result.finishReason);
```

NIM language models can also be used with other AI SDK functions like `generateObject` and `streamObject`.

<Note>
  Model support for tool calls and structured object generation varies. For
  example, the
  [`meta/llama-3.3-70b-instruct`](https://build.nvidia.com/meta/llama-3_3-70b-instruct)
  model supports object generation capabilities. Check each model's
  documentation on NVIDIA Build for specific supported features.
</Note>

---
title: Clarifai
description: Use Clarifai OpenAI compatible API with the AI SDK.
---

