## Live Search

xAI models support Live Search functionality, allowing them to query real-time data from various sources and include it in responses with citations.

### Basic Search

To enable search, specify `searchParameters` with a search mode:

```ts
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const { text, sources } = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'What are the latest developments in AI?',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'auto', // 'auto', 'on', or 'off'
        returnCitations: true,
        maxSearchResults: 5,
      },
    },
  },
});

console.log(text);
console.log('Sources:', sources);
```

### Search Parameters

The following search parameters are available:

- **mode** _'auto' | 'on' | 'off'_

  Search mode preference:

  - `'auto'` (default): Model decides whether to search
  - `'on'`: Always enables search
  - `'off'`: Disables search completely

- **returnCitations** _boolean_

  Whether to return citations in the response. Defaults to `true`.

- **fromDate** _string_

  Start date for search data in ISO8601 format (`YYYY-MM-DD`).

- **toDate** _string_

  End date for search data in ISO8601 format (`YYYY-MM-DD`).

- **maxSearchResults** _number_

  Maximum number of search results to consider. Defaults to 20, max 50.

- **sources** _Array&lt;SearchSource&gt;_

  Data sources to search from. Defaults to `["web", "x"]` if not specified.

### Search Sources

You can specify different types of data sources for search:

#### Web Search

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Best ski resorts in Switzerland',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        sources: [
          {
            type: 'web',
            country: 'CH', // ISO alpha-2 country code
            allowedWebsites: ['ski.com', 'snow-forecast.com'],
            safeSearch: true,
          },
        ],
      },
    },
  },
});
```

#### Web source parameters

- **country** _string_: ISO alpha-2 country code
- **allowedWebsites** _string[]_: Max 5 allowed websites
- **excludedWebsites** _string[]_: Max 5 excluded websites
- **safeSearch** _boolean_: Enable safe search (default: true)

#### X (Twitter) Search

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Latest updates on Grok AI',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        sources: [
          {
            type: 'x',
            includedXHandles: ['grok', 'xai'],
            excludedXHandles: ['openai'],
            postFavoriteCount: 10,
            postViewCount: 100,
          },
        ],
      },
    },
  },
});
```

#### X source parameters

- **includedXHandles** _string[]_: Array of X handles to search (without @ symbol)
- **excludedXHandles** _string[]_: Array of X handles to exclude from search (without @ symbol)
- **postFavoriteCount** _number_: Minimum favorite count of the X posts to consider.
- **postViewCount** _number_: Minimum view count of the X posts to consider.

#### News Search

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Recent tech industry news',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        sources: [
          {
            type: 'news',
            country: 'US',
            excludedWebsites: ['tabloid.com'],
            safeSearch: true,
          },
        ],
      },
    },
  },
});
```

#### News source parameters

- **country** _string_: ISO alpha-2 country code
- **excludedWebsites** _string[]_: Max 5 excluded websites
- **safeSearch** _boolean_: Enable safe search (default: true)

#### RSS Feed Search

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Latest status updates',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        sources: [
          {
            type: 'rss',
            links: ['https://status.x.ai/feed.xml'],
          },
        ],
      },
    },
  },
});
```

#### RSS source parameters

- **links** _string[]_: Array of RSS feed URLs (max 1 currently supported)

### Multiple Sources

You can combine multiple data sources in a single search:

```ts
const result = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'Comprehensive overview of recent AI breakthroughs',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'on',
        returnCitations: true,
        maxSearchResults: 15,
        sources: [
          {
            type: 'web',
            allowedWebsites: ['arxiv.org', 'openai.com'],
          },
          {
            type: 'news',
            country: 'US',
          },
          {
            type: 'x',
            includedXHandles: ['openai', 'deepmind'],
          },
        ],
      },
    },
  },
});
```

### Sources and Citations

When search is enabled with `returnCitations: true`, the response includes sources that were used to generate the answer:

```ts
const { text, sources } = await generateText({
  model: xai('grok-3-latest'),
  prompt: 'What are the latest developments in AI?',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'auto',
        returnCitations: true,
      },
    },
  },
});

// Access the sources used
for (const source of sources) {
  if (source.sourceType === 'url') {
    console.log('Source:', source.url);
  }
}
```

### Streaming with Search

Live Search works with streaming responses. Citations are included when the stream completes:

```ts
import { streamText } from 'ai';

const result = streamText({
  model: xai('grok-3-latest'),
  prompt: 'What has happened in tech recently?',
  providerOptions: {
    xai: {
      searchParameters: {
        mode: 'auto',
        returnCitations: true,
      },
    },
  },
});

for await (const textPart of result.textStream) {
  process.stdout.write(textPart);
}

console.log('Sources:', await result.sources);
```

