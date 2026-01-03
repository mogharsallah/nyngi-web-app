## Reasoning

Amazon Bedrock supports model creator-specific reasoning features:

- Anthropic (e.g. `claude-3-7-sonnet-20250219`): enable via the `reasoningConfig` provider option and specifying a thinking budget in tokens (minimum: `1024`, maximum: `64000`).
- Amazon (e.g. `us.amazon.nova-2-lite-v1:0`): enable via the `reasoningConfig` provider option and specifying a maximum reasoning effort level (`'low' | 'medium' | 'high'`).

```ts
import { bedrock } from '@ai-sdk/amazon-bedrock';
import { generateText } from 'ai';

// Anthropic example
const anthropicResult = await generateText({
  model: bedrock('us.anthropclaude-3-7-sonnet-20250219-v1:0'),
  prompt: 'How many people will live in the world in 2040?',
  providerOptions: {
    bedrock: {
      reasoningConfig: { type: 'enabled', budgetTokens: 1024 },
    },
  },
});

console.log(anthropicResult.reasoningText); // reasoning text
console.log(anthropicResult.text); // text response

// Nova 2 example
const amazonResult = await generateText({
  model: bedrock('us.amazon.nova-2-lite-v1:0'),
  prompt: 'How many people will live in the world in 2040?',
  providerOptions: {
    bedrock: {
      reasoningConfig: { type: 'enabled', maxReasoningEffort: 'medium' },
    },
  },
});

console.log(amazonResult.reasoningText); // reasoning text
console.log(amazonResult.text); // text response
```

See [AI SDK UI: Chatbot](/docs/ai-sdk-ui/chatbot#reasoning) for more details
on how to integrate reasoning into your chatbot.

