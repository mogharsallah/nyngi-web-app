---
name: ai-sdk
description: Use the Vercel AI SDK (ai package) for building AI features. Use when implementing streaming chat, AI agents, tool calling, structured output, or any AI/LLM functionality. Triggers on mentions of AI SDK, useChat, streamText, generateText, or AI streaming.
allowed-tools: WebFetch, Read, Write, Edit, Glob, Grep, Bash
---

# Vercel AI SDK

## Overview

This skill helps you use the Vercel AI SDK correctly in this project.

## Documentation Reference

Before implementing AI SDK features, fetch the latest documentation:

```
WebFetch: https://ai-sdk.dev/llms.txt
```

## Quick Reference

### Core Imports

```typescript
// Server-side streaming
import { streamText, generateText, generateObject } from 'ai';

// Client-side hooks
import { useChat, useCompletion, useObject } from '@ai-sdk/react';

// Providers
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
```

### Common Patterns

#### Streaming Chat (Server Action / Route Handler)

```typescript
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    messages,
    system: 'You are a helpful assistant.',
  });

  return result.toDataStreamResponse();
}
```

#### Client-side useChat Hook

```typescript
'use client';
import { useChat } from '@ai-sdk/react';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <form onSubmit={handleSubmit}>
      {messages.map((m) => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
    </form>
  );
}
```

#### Tool Calling

```typescript
import { streamText, tool } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: google('gemini-2.0-flash-001'),
  messages,
  tools: {
    getWeather: tool({
      description: 'Get weather for a location',
      parameters: z.object({
        location: z.string().describe('City name'),
      }),
      execute: async ({ location }) => {
        return { temperature: 72, condition: 'sunny' };
      },
    }),
  },
  maxSteps: 5, // Allow multi-step tool calls
});
```

#### Structured Output with generateObject

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: google('gemini-2.0-flash-001'),
  schema: z.object({
    name: z.string(),
    score: z.number().min(0).max(100),
  }),
  prompt: 'Generate a player profile',
});
```

#### UI Message Stream Response (for complex UIs)

```typescript
import { createDataStreamResponse, streamText } from 'ai';

return createDataStreamResponse({
  execute: (dataStream) => {
    const result = streamText({
      model: google('gemini-2.0-flash-001'),
      messages,
      onFinish: () => {
        dataStream.writeMessageAnnotation({ saved: true });
      },
    });
    result.mergeIntoDataStream(dataStream);
  },
});
```

## Project-Specific Patterns

When working in this codebase:

1. **Check existing implementations** in `app/api/chat/` for established patterns
2. **Use Google Gemini** as the primary model (see `server/agents/`)
3. **Follow the agent pattern** in `server/agents/` for new AI features
4. **Store instructions** in markdown files under `server/agents/instructions/`

## Instructions

1. Always fetch the latest docs from `https://ai-sdk.dev/llms.txt` before implementing new features
2. Check existing code in `server/agents/` and `app/api/chat/` for project conventions
3. Use Zod schemas for all tool parameters and structured outputs
4. Implement proper error handling for streaming responses
5. Use `toDataStreamResponse()` for simple cases, `createDataStreamResponse()` for complex UIs