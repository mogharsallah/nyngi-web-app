## Provider Options

The AI Gateway provider accepts provider options that control routing behavior and provider-specific configurations.

### Gateway Provider Options

You can use the `gateway` key in `providerOptions` to control how AI Gateway routes requests:

```ts
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Explain quantum computing',
  providerOptions: {
    gateway: {
      order: ['vertex', 'anthropic'], // Try Vertex AI first, then Anthropic
      only: ['vertex', 'anthropic'], // Only use these providers
    } satisfies GatewayProviderOptions,
  },
});
```

The following gateway provider options are available:

- **order** _string[]_

  Specifies the sequence of providers to attempt when routing requests. The gateway will try providers in the order specified. If a provider fails or is unavailable, it will move to the next provider in the list.

  Example: `order: ['bedrock', 'anthropic']` will attempt Amazon Bedrock first, then fall back to Anthropic.

- **only** _string[]_

  Restricts routing to only the specified providers. When set, the gateway will never route to providers not in this list, even if they would otherwise be available.

  Example: `only: ['anthropic', 'vertex']` will only allow routing to Anthropic or Vertex AI.

- **models** _string[]_

  Specifies fallback models to use when the primary model fails or is unavailable. The gateway will try the primary model first (specified in the `model` parameter), then try each model in this array in order until one succeeds.

  Example: `models: ['openai/gpt-5-nano', 'gemini-2.0-flash']` will try the fallback models in order if the primary model fails.

- **user** _string_

  Optional identifier for the end user on whose behalf the request is being made. This is used for spend tracking and attribution purposes, allowing you to track usage per end-user in your application.

  Example: `user: 'user-123'` will associate this request with end-user ID "user-123" in usage reports.

- **tags** _string[]_

  Optional array of tags for categorizing and filtering usage in reports. Useful for tracking spend by feature, prompt version, or any other dimension relevant to your application.

  Example: `tags: ['chat', 'v2']` will tag this request with "chat" and "v2" for filtering in usage analytics.

- **byok** _Record&lt;string, Array&lt;Record&lt;string, unknown&gt;&gt;&gt;_

  Request-scoped BYOK (Bring Your Own Key) credentials to use for this request. When provided, any cached BYOK credentials configured in the gateway system are not considered. Requests may still fall back to use system credentials if the provided credentials fail.

  Each provider can have multiple credentials (tried in order). The structure is a record where keys are provider slugs and values are arrays of credential objects.

  Examples:

  - Single provider: `byok: { 'anthropic': [{ apiKey: 'sk-ant-...' }] }`
  - Multiple credentials: `byok: { 'vertex': [{ project: 'proj-1', googleCredentials: { privateKey: '...', clientEmail: '...' } }, { project: 'proj-2', googleCredentials: { privateKey: '...', clientEmail: '...' } }] }`
  - Multiple providers: `byok: { 'anthropic': [{ apiKey: '...' }], 'bedrock': [{ accessKeyId: '...', secretAccessKey: '...' }] }`

- **zeroDataRetention** _boolean_

  Restricts routing requests to providers that have zero data retention policies.

You can combine these options to have fine-grained control over routing and tracking:

```ts
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Write a haiku about programming',
  providerOptions: {
    gateway: {
      order: ['vertex'], // Prefer Vertex AI
      only: ['anthropic', 'vertex'], // Only allow these providers
    } satisfies GatewayProviderOptions,
  },
});
```

#### Model Fallbacks Example

The `models` option enables automatic fallback to alternative models when the primary model fails:

```ts
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-4o', // Primary model
  prompt: 'Write a TypeScript haiku',
  providerOptions: {
    gateway: {
      models: ['openai/gpt-5-nano', 'gemini-2.0-flash'], // Fallback models
    } satisfies GatewayProviderOptions,
  },
});

// This will:
// 1. Try openai/gpt-4o first
// 2. If it fails, try openai/gpt-5-nano
// 3. If that fails, try gemini-2.0-flash
// 4. Return the result from the first model that succeeds
```

#### Zero Data Retention Example

Set `zeroDataRetention` to true to ensure requests are only routed to providers
that have zero data retention policies. When `zeroDataRetention` is `false` or not
specified, there is no enforcement of restricting routing.

```ts
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Analyze this sensitive document...',
  providerOptions: {
    gateway: {
      zeroDataRetention: true,
    } satisfies GatewayProviderOptions,
  },
});
```

### Provider-Specific Options

When using provider-specific options through AI Gateway, use the actual provider name (e.g. `anthropic`, `openai`, not `gateway`) as the key:

```ts
import type { AnthropicProviderOptions } from '@ai-sdk/anthropic';
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4',
  prompt: 'Explain quantum computing',
  providerOptions: {
    gateway: {
      order: ['vertex', 'anthropic'],
    } satisfies GatewayProviderOptions,
    anthropic: {
      thinking: { type: 'enabled', budgetTokens: 12000 },
    } satisfies AnthropicProviderOptions,
  },
});
```

This works with any provider supported by AI Gateway. Each provider has its own set of options - see the individual [provider documentation pages](/providers/ai-sdk-providers) for details on provider-specific options.

### Available Providers

AI Gateway supports routing to 20+ providers.

For a complete list of available providers and their slugs, see the [AI Gateway documentation](https://vercel.com/docs/ai-gateway/provider-options#available-providers).

