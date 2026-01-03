## Browser Search Tool

Groq provides a browser search tool that offers interactive web browsing capabilities. Unlike traditional web search, browser search navigates websites interactively, providing more detailed and comprehensive results.

### Supported Models

Browser search is only available for these specific models:

- `openai/gpt-oss-20b`
- `openai/gpt-oss-120b`

<Note type="warning">
  Browser search will only work with the supported models listed above. Using it
  with other models will generate a warning and the tool will be ignored.
</Note>

### Basic Usage

```ts
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

const result = await generateText({
  model: groq('openai/gpt-oss-120b'), // Must use supported model
  prompt:
    'What are the latest developments in AI? Please search for recent news.',
  tools: {
    browser_search: groq.tools.browserSearch({}),
  },
  toolChoice: 'required', // Ensure the tool is used
});

console.log(result.text);
```

### Streaming Example

```ts
import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

const result = streamText({
  model: groq('openai/gpt-oss-120b'),
  prompt: 'Search for the latest tech news and summarize it.',
  tools: {
    browser_search: groq.tools.browserSearch({}),
  },
  toolChoice: 'required',
});

for await (const delta of result.fullStream) {
  if (delta.type === 'text-delta') {
    process.stdout.write(delta.text);
  }
}
```

### Key Features

- **Interactive Browsing**: Navigates websites like a human user
- **Comprehensive Results**: More detailed than traditional search snippets
- **Server-side Execution**: Runs on Groq's infrastructure, no setup required
- **Powered by Exa**: Uses Exa search engine for optimal results
- **Currently Free**: Available at no additional charge during beta

### Best Practices

- Use `toolChoice: 'required'` to ensure the browser search is activated
- Only supported on `openai/gpt-oss-20b` and `openai/gpt-oss-120b` models
- The tool works automatically - no configuration parameters needed
- Server-side execution means no additional API keys or setup required

### Model Validation

The provider automatically validates model compatibility:

```ts
// ✅ Supported - will work
const result = await generateText({
  model: groq('openai/gpt-oss-120b'),
  tools: { browser_search: groq.tools.browserSearch({}) },
});

// ❌ Unsupported - will show warning and ignore tool
const result = await generateText({
  model: groq('gemma2-9b-it'),
  tools: { browser_search: groq.tools.browserSearch({}) },
});
// Warning: "Browser search is only supported on models: openai/gpt-oss-20b, openai/gpt-oss-120b"
```

<Note>
  For more details about browser search capabilities and limitations, see the
  [Groq Browser Search
  Documentation](https://console.groq.com/docs/browser-search).
</Note>

