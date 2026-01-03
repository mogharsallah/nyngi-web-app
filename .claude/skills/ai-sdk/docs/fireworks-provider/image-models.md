## Image Models

You can create Fireworks image models using the `.image()` factory method.
For more on image generation with the AI SDK see [generateImage()](/docs/reference/ai-sdk-core/generate-image).

```ts
import { fireworks } from '@ai-sdk/fireworks';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: fireworks.image('accounts/fireworks/models/flux-1-dev-fp8'),
  prompt: 'A futuristic cityscape at sunset',
  aspectRatio: '16:9',
});
```

<Note>
  Model support for `size` and `aspectRatio` parameters varies. See the [Model
  Capabilities](#model-capabilities-1) section below for supported dimensions,
  or check the model's documentation on [Fireworks models
  page](https://fireworks.ai/models) for more details.
</Note>

### Image Editing

Fireworks supports image editing through FLUX Kontext models (`flux-kontext-pro` and `flux-kontext-max`). Pass input images via `prompt.images` to transform or edit existing images.

<Note>
  Fireworks Kontext models do not support explicit masks. Editing is
  prompt-driven — describe what you want to change in the text prompt.
</Note>

#### Basic Image Editing

Transform an existing image using text prompts:

```ts
const imageBuffer = readFileSync('./input-image.png');

const { images } = await generateImage({
  model: fireworks.image('accounts/fireworks/models/flux-kontext-pro'),
  prompt: {
    text: 'Turn the cat into a golden retriever dog',
    images: [imageBuffer],
  },
  providerOptions: {
    fireworks: {
      output_format: 'jpeg',
    },
  },
});
```

#### Style Transfer

Apply artistic styles to an image:

```ts
const imageBuffer = readFileSync('./input-image.png');

const { images } = await generateImage({
  model: fireworks.image('accounts/fireworks/models/flux-kontext-pro'),
  prompt: {
    text: 'Transform this into a watercolor painting style',
    images: [imageBuffer],
  },
  aspectRatio: '1:1',
});
```

<Note>
  Input images can be provided as `Buffer`, `ArrayBuffer`, `Uint8Array`, or
  base64-encoded strings. Fireworks only supports a single input image per
  request.
</Note>

### Model Capabilities

For all models supporting aspect ratios, the following aspect ratios are supported:

`1:1 (default), 2:3, 3:2, 4:5, 5:4, 16:9, 9:16, 9:21, 21:9`

For all models supporting size, the following sizes are supported:

`640 x 1536, 768 x 1344, 832 x 1216, 896 x 1152, 1024x1024 (default), 1152 x 896, 1216 x 832, 1344 x 768, 1536 x 640`

| Model                                                        | Dimensions Specification | Image Editing       |
| ------------------------------------------------------------ | ------------------------ | ------------------- |
| `accounts/fireworks/models/flux-kontext-pro`                 | Aspect Ratio             | <Check size={18} /> |
| `accounts/fireworks/models/flux-kontext-max`                 | Aspect Ratio             | <Check size={18} /> |
| `accounts/fireworks/models/flux-1-dev-fp8`                   | Aspect Ratio             | <Cross size={18} /> |
| `accounts/fireworks/models/flux-1-schnell-fp8`               | Aspect Ratio             | <Cross size={18} /> |
| `accounts/fireworks/models/playground-v2-5-1024px-aesthetic` | Size                     | <Cross size={18} /> |
| `accounts/fireworks/models/japanese-stable-diffusion-xl`     | Size                     | <Cross size={18} /> |
| `accounts/fireworks/models/playground-v2-1024px-aesthetic`   | Size                     | <Cross size={18} /> |
| `accounts/fireworks/models/SSD-1B`                           | Size                     | <Cross size={18} /> |
| `accounts/fireworks/models/stable-diffusion-xl-1024-v1-0`    | Size                     | <Cross size={18} /> |

For more details, see the [Fireworks models page](https://fireworks.ai/models).

#### Stability AI Models

Fireworks also presents several Stability AI models backed by Stability AI API
keys and endpoint. The AI SDK Fireworks provider does not currently include
support for these models:

| Model ID                               |
| -------------------------------------- |
| `accounts/stability/models/sd3-turbo`  |
| `accounts/stability/models/sd3-medium` |
| `accounts/stability/models/sd3`        |

---
title: DeepSeek
description: Learn how to use DeepSeek's models with the AI SDK.
---

