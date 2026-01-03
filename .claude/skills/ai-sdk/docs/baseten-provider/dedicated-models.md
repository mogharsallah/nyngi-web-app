## Dedicated Models

Baseten supports dedicated model URLs for both chat and embedding models. You have to specify a `modelURL` when creating the provider:

### OpenAI-Compatible Endpoints (`/sync/v1`)

For models deployed with Baseten's OpenAI-compatible endpoints:

```ts
import { createBaseten } from '@ai-sdk/baseten';

const baseten = createBaseten({
  modelURL: 'https://model-{MODEL_ID}.api.baseten.co/sync/v1',
});
// No modelId is needed because we specified modelURL
const model = baseten();
const { text } = await generateText({
  model: model,
  prompt: 'Say hello from a Baseten chat model!',
});
```

### `/predict` Endpoints

`/predict` endpoints are currently NOT supported for chat models. You must use `/sync/v1` endpoints for chat functionality.

