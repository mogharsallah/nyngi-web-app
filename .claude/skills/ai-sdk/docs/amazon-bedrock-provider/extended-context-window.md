## Extended Context Window

Claude Sonnet 4 models on Amazon Bedrock support an extended context window of up to 1 million tokens when using the `context-1m-2025-08-07` beta feature.

```ts
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

const result = await generateText({
  model: bedrock('us.anthropic.claude-sonnet-4-20250514-v1:0'),
  prompt: 'analyze this large document...',
  providerOptions: {
    bedrock: {
      anthropicBeta: ['context-1m-2025-08-07'],
    },
  },
});
```

