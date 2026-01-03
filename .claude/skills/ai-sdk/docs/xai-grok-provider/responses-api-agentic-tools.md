## Responses API (Agentic Tools)

You can use the xAI Responses API with the `xai.responses(modelId)` factory method for server-side agentic tool calling. This enables the model to autonomously orchestrate tool calls and research on xAI's servers.

```ts
const model = xai.responses('grok-4-fast');
```

The Responses API provides server-side tools that the model can autonomously execute during its reasoning process:

- **web_search**: Real-time web search and page browsing
- **x_search**: Search X (Twitter) posts, users, and threads
- **code_execution**: Execute Python code for calculations and data analysis

### Web Search Tool

The web search tool enables autonomous web research with optional domain filtering and image understanding:

```ts
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const { text, sources } = await generateText({
  model: xai.responses('grok-4-fast'),
  prompt: 'What are the latest developments in AI?',
  tools: {
    web_search: xai.tools.webSearch({
      allowedDomains: ['arxiv.org', 'openai.com'],
      enableImageUnderstanding: true,
    }),
  },
});

console.log(text);
console.log('Citations:', sources);
```

#### Web Search Parameters

- **allowedDomains** _string[]_

  Only search within specified domains (max 5). Cannot be used with `excludedDomains`.

- **excludedDomains** _string[]_

  Exclude specified domains from search (max 5). Cannot be used with `allowedDomains`.

- **enableImageUnderstanding** _boolean_

  Enable the model to view and analyze images found during search. Increases token usage.

### X Search Tool

The X search tool enables searching X (Twitter) for posts, with filtering by handles and date ranges:

```ts
const { text, sources } = await generateText({
  model: xai.responses('grok-4-fast'),
  prompt: 'What are people saying about AI on X this week?',
  tools: {
    x_search: xai.tools.xSearch({
      allowedXHandles: ['elonmusk', 'xai'],
      fromDate: '2025-10-23',
      toDate: '2025-10-30',
      enableImageUnderstanding: true,
      enableVideoUnderstanding: true,
    }),
  },
});
```

#### X Search Parameters

- **allowedXHandles** _string[]_

  Only search posts from specified X handles (max 10). Cannot be used with `excludedXHandles`.

- **excludedXHandles** _string[]_

  Exclude posts from specified X handles (max 10). Cannot be used with `allowedXHandles`.

- **fromDate** _string_

  Start date for posts in ISO8601 format (`YYYY-MM-DD`).

- **toDate** _string_

  End date for posts in ISO8601 format (`YYYY-MM-DD`).

- **enableImageUnderstanding** _boolean_

  Enable the model to view and analyze images in X posts.

- **enableVideoUnderstanding** _boolean_

  Enable the model to view and analyze videos in X posts.

### Code Execution Tool

The code execution tool enables the model to write and execute Python code for calculations and data analysis:

```ts
const { text } = await generateText({
  model: xai.responses('grok-4-fast'),
  prompt:
    'Calculate the compound interest for $10,000 at 5% annually for 10 years',
  tools: {
    code_execution: xai.tools.codeExecution(),
  },
});
```

### File Search Tool

xAI supports file search through OpenAI compatibility. You can use the OpenAI provider with xAI's base URL to search vector stores:

```ts
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openai = createOpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY,
});

const result = streamText({
  model: openai('grok-4'),
  prompt: 'What documents do you have access to?',
  tools: {
    file_search: openai.tools.fileSearch({
      vectorStoreIds: ['your-vector-store-id'],
      maxNumResults: 5,
    }),
  },
});
```

<Note>
  File search requires grok-4 family models. See the [OpenAI
  provider](/providers/ai-sdk-providers/openai) documentation for additional
  file search options like filters and ranking.
</Note>

### Multiple Tools

You can combine multiple server-side tools for comprehensive research:

```ts
import { xai } from '@ai-sdk/xai';
import { streamText } from 'ai';

const { fullStream } = streamText({
  model: xai.responses('grok-4-fast'),
  prompt: 'Research AI safety developments and calculate risk metrics',
  tools: {
    web_search: xai.tools.webSearch(),
    x_search: xai.tools.xSearch(),
    code_execution: xai.tools.codeExecution(),
  },
});

for await (const part of fullStream) {
  if (part.type === 'text-delta') {
    process.stdout.write(part.text);
  } else if (part.type === 'source' && part.sourceType === 'url') {
    console.log('\nSource:', part.url);
  }
}
```

### Provider Options

The Responses API supports the following provider options:

```ts
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const result = await generateText({
  model: xai.responses('grok-4-fast'),
  providerOptions: {
    xai: {
      reasoningEffort: 'high',
    },
  },
  // ...
});
```

The following provider options are available:

- **reasoningEffort** _'low' | 'high'_

  Control the reasoning effort for the model. Higher effort may produce more thorough results at the cost of increased latency and token usage.

<Note>
  The Responses API only supports server-side tools. You cannot mix server-side
  tools with client-side function tools in the same request.
</Note>

