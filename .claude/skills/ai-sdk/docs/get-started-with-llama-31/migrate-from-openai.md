## Migrate from OpenAI

One of the key advantages of the AI SDK is its unified API, which makes it incredibly easy to switch between different AI models and providers. This flexibility is particularly useful when you want to migrate from one model to another, such as moving from OpenAI's GPT models to Meta's Llama models hosted on DeepInfra.

Here's how simple the migration process can be:

**OpenAI Example:**

```tsx
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4.1'),
  prompt: 'What is love?',
});
```

**Llama on DeepInfra Example:**

```tsx
import { generateText } from 'ai';
import { deepinfra } from '@ai-sdk/deepinfra';

const { text } = await generateText({
  model: deepinfra('meta-llama/Meta-Llama-3.1-70B-Instruct'),
  prompt: 'What is love?',
});
```

Thanks to the unified API, the core structure of the code remains the same. The main differences are:

1. Creating a DeepInfra client
2. Changing the model name from `openai("gpt-4.1")` to `deepinfra("meta-llama/Meta-Llama-3.1-70B-Instruct")`.

With just these few changes, you've migrated from using OpenAI's GPT-4-Turbo to Meta's Llama 3.1 hosted on DeepInfra. The `generateText` function and its usage remain identical, showcasing the power of the AI SDK's unified API.

This feature allows you to easily experiment with different models, compare their performance, and choose the best one for your specific use case without having to rewrite large portions of your codebase.

