## Image Models

You can create Luma image models using the `.image()` factory method.
For more on image generation with the AI SDK see [generateImage()](/docs/reference/ai-sdk-core/generate-image).

### Basic Usage

```ts
import { luma, type LumaImageProviderOptions } from '@ai-sdk/luma';
import { generateImage } from 'ai';
import fs from 'fs';

const { image } = await generateImage({
  model: luma.image('photon-1'),
  prompt: 'A serene mountain landscape at sunset',
  aspectRatio: '16:9',
});

const filename = `image-${Date.now()}.png`;
fs.writeFileSync(filename, image.uint8Array);
console.log(`Image saved to ${filename}`);
```

### Image Model Settings

You can customize the generation behavior with optional settings:

```ts
const { image } = await generateImage({
  model: luma.image('photon-1'),
  prompt: 'A serene mountain landscape at sunset',
  aspectRatio: '16:9',
  maxImagesPerCall: 1, // Maximum number of images to generate per API call
  providerOptions: {
    luma: {
      pollIntervalMillis: 5000, // How often to check for completed images (in ms)
      maxPollAttempts: 10, // Maximum number of polling attempts before timeout
    },
  } satisfies LumaImageProviderOptions,
});
```

Since Luma processes images through an asynchronous queue system, these settings allow you to tune the polling behavior:

- **maxImagesPerCall** _number_

  Override the maximum number of images generated per API call. Defaults to 1.

- **pollIntervalMillis** _number_

  Control how frequently the API is checked for completed images while they are
  being processed. Defaults to 500ms.

- **maxPollAttempts** _number_

  Limit how long to wait for results before timing out, since image generation
  is queued asynchronously. Defaults to 120 attempts.

### Model Capabilities

Luma offers two main models:

| Model            | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `photon-1`       | High-quality image generation with superior prompt understanding |
| `photon-flash-1` | Faster generation optimized for speed while maintaining quality  |

Both models support the following aspect ratios:

- 1:1
- 3:4
- 4:3
- 9:16
- 16:9 (default)
- 9:21
- 21:9

For more details about supported aspect ratios, see the [Luma Image Generation documentation](https://docs.lumalabs.ai/docs/image-generation).

Key features of Luma models include:

- Ultra-high quality image generation
- 10x higher cost efficiency compared to similar models
- Superior prompt understanding and adherence
- Unique character consistency capabilities from single reference images
- Multi-image reference support for precise style matching

### Image editing

Luma supports different modes of generating images that reference other images.

#### Modify an image

Images have to be passed as URLs. `weight` can be configured for each image in the `providerOPtions.luma.images` array.

```ts
await generateImage({
  model: luma.image('photon-flash-1'),
  prompt: {
    text: 'transform the bike to a boat',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/future-me-8hcBWcZOkbE53q3gshhEm16S87qDpF.jpeg',
    ],
  },
  providerOptions: {
    luma: {
      images: [{ weight: 1.0 }],
    } satisfies LumaImageProviderOptions,
  },
});
```

Learn more at https://docs.lumalabs.ai/docs/image-generation#modify-image.

#### Referen an image

Use up to 4 reference images to guide your generation. Useful for creating variations or visualizing complex concepts. Adjust the `weight` for each image (0-1) to control the influence of reference images.

```ts
await generateImage({
  model: luma.image('photon-flash-1'),
  prompt: {
    text: 'A salamander at dusk in a forest pond, in the style of ukiyo-e',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/future-me-8hcBWcZOkbE53q3gshhEm16S87qDpF.jpeg',
    ],
  },
  aspectRatio: '1:1',
  providerOptions: {
    luma: {
      referenceType: 'image',
      images: [{ weight: 0.8 }],
    } satisfies LumaImageProviderOptions,
  },
});
```

Learn more at https://docs.lumalabs.ai/docs/image-generation#image-reference

#### Style Reference

Apply specific visual styles to your generations using reference images. Control the style influence using the `weight` parameter.

```ts
await generateImage({
  model: luma.image('photon-flash-1'),
  prompt: 'A blue cream Persian cat launching its website on Vercel',
  aspectRatio: '1:1',
  providerOptions: {
    luma: {
      referenceType: 'style',
      images: [{ weight: 0.8 }],
    } satisfies LumaImageProviderOptions,
  },
});
```

Learn more at https://docs.lumalabs.ai/docs/image-generation#style-reference

#### Character Reference

Create consistent and personalized characters using up to 4 reference images of the same subject. More reference images improve character representation.

```ts
await generateImage({
  model: luma.image('photon-flash-1'),
  prompt: {
    text: 'A woman with a cat riding a broomstick in a forest',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/future-me-8hcBWcZOkbE53q3gshhEm16S87qDpF.jpeg',
    ],
  },
  aspectRatio: '1:1',
  providerOptions: {
    luma: {
      referenceType: 'character',
      images: [
        {
          id: 'identity0',
        },
      ],
    } satisfies LumaImageProviderOptions,
  },
});
```

Learn more at https://docs.lumalabs.ai/docs/image-generation#character-reference

---
title: ElevenLabs
description: Learn how to use the ElevenLabs provider for the AI SDK.
---

