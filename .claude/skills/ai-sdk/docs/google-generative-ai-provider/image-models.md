## Image Models

You can create [Imagen](https://ai.google.dev/gemini-api/imagen) models that call the Google Generative AI API using the `.image()` factory method.
For more on image generation with the AI SDK see [generateImage()](/docs/reference/ai-sdk-core/generate-image).

```ts
import { google } from '@ai-sdk/google';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: google.image('imagen-4.0-generate-001'),
  prompt: 'A futuristic cityscape at sunset',
  aspectRatio: '16:9',
});
```

Further configuration can be done using Google provider options. You can validate the provider options using the `GoogleGenerativeAIImageProviderOptions` type.

```ts
import { google } from '@ai-sdk/google';
import { GoogleGenerativeAIImageProviderOptions } from '@ai-sdk/google';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: google.image('imagen-4.0-generate-001'),
  providerOptions: {
    google: {
      personGeneration: 'dont_allow',
    } satisfies GoogleGenerativeAIImageProviderOptions,
  },
  // ...
});
```

The following provider options are available:

- **personGeneration** `allow_adult` | `allow_all` | `dont_allow`
  Whether to allow person generation. Defaults to `allow_adult`.

<Note>
  Imagen models do not support the `size` parameter. Use the `aspectRatio`
  parameter instead.
</Note>

#### Model Capabilities

| Model                     | Aspect Ratios             |
| ------------------------- | ------------------------- |
| `imagen-4.0-generate-001` | 1:1, 3:4, 4:3, 9:16, 16:9 |

---
title: Hume
description: Learn how to use the Hume provider for the AI SDK.
---

