## Using DevTools

### Add the middleware

Wrap your language model with the DevTools middleware using [`wrapLanguageModel`](/docs/ai-sdk-core/middleware):

```ts
import { wrapLanguageModel, gateway } from 'ai';
import { devToolsMiddleware } from '@ai-sdk/devtools';

const model = wrapLanguageModel({
  model: gateway('anthropic/claude-sonnet-4.5'),
  middleware: devToolsMiddleware(),
});
```

The wrapped model can be used with any AI SDK Core function:

```ts highlight="2"
import { generateText } from 'ai';

const result = await generateText({
  model, // wrapped model with DevTools
  prompt: 'What cities are in the United States?',
});
```

### Launch the viewer

Start the DevTools viewer:

```bash
npx @ai-sdk/devtools
```

Open [http://localhost:4983](http://localhost:4983) to view your AI SDK interactions.

