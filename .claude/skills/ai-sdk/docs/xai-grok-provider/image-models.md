## Image Models

You can create xAI image models using the `.image()` factory method. For more on image generation with the AI SDK see [generateImage()](/docs/reference/ai-sdk-core/generate-image).

```ts
import { xai } from '@ai-sdk/xai';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: xai.image('grok-2-image'),
  prompt: 'A futuristic cityscape at sunset',
});
```

<Note>
  The xAI image model does not currently support the `aspectRatio` or `size`
  parameters. Image size defaults to 1024x768.
</Note>

### Model-specific options

You can customize the image generation behavior with model-specific settings:

```ts
import { xai } from '@ai-sdk/xai';
import { generateImage } from 'ai';

const { images } = await generateImage({
  model: xai.image('grok-2-image'),
  prompt: 'A futuristic cityscape at sunset',
  maxImagesPerCall: 5, // Default is 10
  n: 2, // Generate 2 images
});
```

### Model Capabilities

| Model          | Sizes              | Notes                                                                                                                                                                                                    |
| -------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grok-2-image` | 1024x768 (default) | xAI's text-to-image generation model, designed to create high-quality images from text prompts. It's trained on a diverse dataset and can generate images across various styles, subjects, and settings. |

---
title: Vercel
description: Learn how to use Vercel's v0 models with the AI SDK.
---

