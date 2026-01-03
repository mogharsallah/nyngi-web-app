## Speech Models

You can create models that call the [Hume speech API](https://dev.hume.ai/docs/text-to-speech-tts/overview)
using the `.speech()` factory method.

```ts
const model = hume.speech();
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying a voice to use for the generated audio.

```ts highlight="6"
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { hume } from '@ai-sdk/hume';

const result = await generateSpeech({
  model: hume.speech(),
  text: 'Hello, world!',
  voice: 'd8ab67c6-953d-4bd8-9370-8fa53a0f1453',
  providerOptions: { hume: {} },
});
```

The following provider options are available:

- **context** _object_

  Either:

  - `{ generationId: string }` - A generation ID to use for context.
  - `{ utterances: HumeUtterance[] }` - An array of utterance objects for context.

### Model Capabilities

| Model     | Instructions        |
| --------- | ------------------- |
| `default` | <Check size={18} /> |

---
title: Google Vertex AI
description: Learn how to use the Google Vertex AI provider.
---

