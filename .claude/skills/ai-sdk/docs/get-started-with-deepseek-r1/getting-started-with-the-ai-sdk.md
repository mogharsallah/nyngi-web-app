## Getting Started with the AI SDK

The AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the AI SDK is [AI SDK Core](/docs/ai-sdk-core/overview), which provides a unified API to call any LLM. The code snippet below is all you need to call DeepSeek R1 with the AI SDK:

```ts
import { deepseek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';

const { reasoningText, text } = await generateText({
  model: deepseek('deepseek-reasoner'),
  prompt: 'Explain quantum entanglement.',
});
```

The unified interface also means that you can easily switch between providers by changing just two lines of code. For example, to use DeepSeek R1 via Fireworks:

```ts
import { fireworks } from '@ai-sdk/fireworks';
import {
  generateText,
  wrapLanguageModel,
  extractReasoningMiddleware,
} from 'ai';

// middleware to extract reasoning tokens
const enhancedModel = wrapLanguageModel({
  model: fireworks('accounts/fireworks/models/deepseek-r1'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});

const { reasoningText, text } = await generateText({
  model: enhancedModel,
  prompt: 'Explain quantum entanglement.',
});
```

Or to use Groq's `deepseek-r1-distill-llama-70b` model:

```ts
import { groq } from '@ai-sdk/groq';
import {
  generateText,
  wrapLanguageModel,
  extractReasoningMiddleware,
} from 'ai';

// middleware to extract reasoning tokens
const enhancedModel = wrapLanguageModel({
  model: groq('deepseek-r1-distill-llama-70b'),
  middleware: extractReasoningMiddleware({ tagName: 'think' }),
});

const { reasoningText, text } = await generateText({
  model: enhancedModel,
  prompt: 'Explain quantum entanglement.',
});
```

<Note id="deepseek-r1-middleware">
The AI SDK provides a [middleware](/docs/ai-sdk-core/middleware)
(`extractReasoningMiddleware`) that can be used to extract the reasoning
tokens from the model's output.

When using DeepSeek-R1 series models with third-party providers like Together AI, we recommend using the `startWithReasoning`
option in the `extractReasoningMiddleware` function, as they tend to bypass thinking patterns.

</Note>

### Model Provider Comparison

You can use DeepSeek R1 with the AI SDK through various providers. Here's a comparison of the providers that support DeepSeek R1:

| Provider                                                | Model ID                                                                                                          | Reasoning Tokens    |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------- |
| [DeepSeek](/providers/ai-sdk-providers/deepseek)        | [`deepseek-reasoner`](https://api-docs.deepseek.com/guides/reasoning_model)                                       | <Check size={18} /> |
| [Fireworks](/providers/ai-sdk-providers/fireworks)      | [`accounts/fireworks/models/deepseek-r1`](https://fireworks.ai/models/fireworks/deepseek-r1)                      | Requires Middleware |
| [Groq](/providers/ai-sdk-providers/groq)                | [`deepseek-r1-distill-llama-70b`](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Llama-70B)               | Requires Middleware |
| [Azure](/providers/ai-sdk-providers/azure)              | [`DeepSeek-R1`](https://ai.azure.com/explore/models/DeepSeek-R1/version/1/registry/azureml-deepseek#code-samples) | Requires Middleware |
| [Together AI](/providers/ai-sdk-providers/togetherai)   | [`deepseek-ai/DeepSeek-R1`](https://www.together.ai/models/deepseek-r1)                                           | Requires Middleware |
| [FriendliAI](/providers/community-providers/friendliai) | [`deepseek-r1`](https://huggingface.co/deepseek-ai/DeepSeek-R1)                                                   | Requires Middleware |
| [LangDB](/providers/community-providers/langdb)         | [`deepseek/deepseek-reasoner`](https://docs.langdb.ai/guides/deepseek)                                            | Requires Middleware |

### Building Interactive Interfaces

AI SDK Core can be paired with [AI SDK UI](/docs/ai-sdk-ui/overview), another powerful component of the AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, and SvelteKit.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — [`useChat`](/docs/reference/ai-sdk-ui/use-chat), [`useCompletion`](/docs/reference/ai-sdk-ui/use-completion), and [`useObject`](/docs/reference/ai-sdk-ui/use-object) — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

Let's explore building a chatbot with [Next.js](https://nextjs.org), the AI SDK, and DeepSeek R1:

In a new Next.js application, first install the AI SDK and the DeepSeek provider:

<Snippet text="pnpm install ai @ai-sdk/deepseek @ai-sdk/react" />

Then, create a route handler for the chat endpoint:

```tsx filename="app/api/chat/route.ts"
import { deepseek } from '@ai-sdk/deepseek';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: deepseek('deepseek-reasoner'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
```

<Note>
  You can forward the model's reasoning tokens to the client with
  `sendReasoning: true` in the `toDataStreamResponse` method.
</Note>

Finally, update the root page (`app/page.tsx`) to use the `useChat` hook:

```tsx filename="app/page.tsx"
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => {
            if (part.type === 'reasoning') {
              return <pre key={index}>{part.text}</pre>;
            }
            if (part.type === 'text') {
              return <span key={index}>{part.text}</span>;
            }
            return null;
          })}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

<Note>
  You can access the model's reasoning tokens through the `parts` array on the
  `message` object, where reasoning parts have `type: 'reasoning'`.
</Note>

The useChat hook on your root page (`app/page.tsx`) will make a request to your AI provider endpoint (`app/api/chat/route.ts`) whenever the user submits a message. The messages are then displayed in the chat UI.

