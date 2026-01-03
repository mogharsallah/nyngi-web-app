## Language Models

You can create Perplexity models using a provider instance:

```ts
import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';

const { text } = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
});
```

### Sources

Websites that have been used to generate the response are included in the `sources` property of the result:

```ts
import { perplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';

const { text, sources } = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
});

console.log(sources);
```

### Provider Options & Metadata

The Perplexity provider includes additional metadata in the response through `providerMetadata`.
Additional configuration options are available through `providerOptions`.

```ts
const result = await generateText({
  model: perplexity('sonar-pro'),
  prompt: 'What are the latest developments in quantum computing?',
  providerOptions: {
    perplexity: {
      return_images: true, // Enable image responses (Tier-2 Perplexity users only)
    },
  },
});

console.log(result.providerMetadata);
// Example output:
// {
//   perplexity: {
//     usage: { citationTokens: 5286, numSearchQueries: 1 },
//     images: [
//       { imageUrl: "https://example.com/image1.jpg", originUrl: "https://elsewhere.com/page1", height: 1280, width: 720 },
//       { imageUrl: "https://example.com/image2.jpg", originUrl: "https://elsewhere.com/page2", height: 1280, width: 720 }
//     ]
//   },
// }
```

The metadata includes:

- `usage`: Object containing `citationTokens` and `numSearchQueries` metrics
- `images`: Array of image URLs when `return_images` is enabled (Tier-2 users only)

You can enable image responses by setting `return_images: true` in the provider options. This feature is only available to Perplexity Tier-2 users and above.

### PDF Support

The Perplexity provider supports reading PDF files.
You can pass PDF files as part of the message content using the `file` type:

```ts
const result = await generateText({
  model: perplexity('sonar-pro'),
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'What is this document about?',
        },
        {
          type: 'file',
          data: fs.readFileSync('./data/ai.pdf'),
          mediaType: 'application/pdf',
          filename: 'ai.pdf', // optional
        },
      ],
    },
  ],
});
```

You can also pass the URL of a PDF:

```ts
{
  type: 'file',
  data: new URL('https://example.com/document.pdf'),
  mediaType: 'application/pdf',
  filename: 'document.pdf', // optional
}
```

The model will have access to the contents of the PDF file and
respond to questions about it.

<Note>
  For more details about Perplexity's capabilities, see the [Perplexity chat
  completion docs](https://docs.perplexity.ai/api-reference/chat-completions).
</Note>

