## Image Models

You can create Together.ai image models using the `.image()` factory method.
For more on image generation with the AI SDK see [generateImage()](/docs/reference/ai-sdk-core/generate-image).

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { generateImage } from 'ai';

const { images } = await generateImage({
  model: togetherai.image('black-forest-labs/FLUX.1-dev'),
  prompt: 'A delighted resplendent quetzal mid flight amidst raindrops',
});
```

You can pass optional provider-specific request parameters using the `providerOptions` argument.

```ts
import { togetherai } from '@ai-sdk/togetherai';
import { generateImage } from 'ai';

const { images } = await generateImage({
  model: togetherai.image('black-forest-labs/FLUX.1-dev'),
  prompt: 'A delighted resplendent quetzal mid flight amidst raindrops',
  size: '512x512',
  // Optional additional provider-specific request parameters
  providerOptions: {
    togetherai: {
      steps: 40,
    },
  },
});
```

For a complete list of available provider-specific options, see the [Together.ai Image Generation API Reference](https://docs.together.ai/reference/post_images-generations).

### Image Editing

Together AI supports image editing through FLUX Kontext models. Pass input images via `prompt.images` to transform or edit existing images.

<Note>
  Together AI does not support mask-based inpainting. Instead, use descriptive
  prompts to specify what you want to change in the image.
</Note>

#### Basic Image Editing

Transform an existing image using text prompts:

```ts
const imageBuffer = readFileSync('./input-image.png');

const { images } = await generateImage({
  model: togetherai.image('black-forest-labs/FLUX.1-kontext-pro'),
  prompt: {
    text: 'Turn the cat into a golden retriever dog',
    images: [imageBuffer],
  },
  size: '1024x1024',
  providerOptions: {
    togetherai: {
      steps: 28,
    },
  },
});
```

#### Editing with URL Reference

You can also pass image URLs directly:

```ts
const { images } = await generateImage({
  model: togetherai.image('black-forest-labs/FLUX.1-kontext-pro'),
  prompt: {
    text: 'Make the background a lush rainforest',
    images: ['https://example.com/photo.png'],
  },
  size: '1024x1024',
  providerOptions: {
    togetherai: {
      steps: 28,
    },
  },
});
```

<Note>
  Input images can be provided as `Buffer`, `ArrayBuffer`, `Uint8Array`,
  base64-encoded strings, or URLs. Together AI only supports a single input
  image per request.
</Note>

#### Supported Image Editing Models

| Model                                  | Description                        |
| -------------------------------------- | ---------------------------------- |
| `black-forest-labs/FLUX.1-kontext-pro` | Production quality, balanced speed |
| `black-forest-labs/FLUX.1-kontext-max` | Maximum image fidelity             |
| `black-forest-labs/FLUX.1-kontext-dev` | Development and experimentation    |

### Model Capabilities

Together.ai image models support various image dimensions that vary by model. Common sizes include 512x512, 768x768, and 1024x1024, with some models supporting up to 1792x1792. The default size is 1024x1024.

| Available Models                           |
| ------------------------------------------ |
| `stabilityai/stable-diffusion-xl-base-1.0` |
| `black-forest-labs/FLUX.1-dev`             |
| `black-forest-labs/FLUX.1-dev-lora`        |
| `black-forest-labs/FLUX.1-schnell`         |
| `black-forest-labs/FLUX.1-canny`           |
| `black-forest-labs/FLUX.1-depth`           |
| `black-forest-labs/FLUX.1-redux`           |
| `black-forest-labs/FLUX.1.1-pro`           |
| `black-forest-labs/FLUX.1-pro`             |
| `black-forest-labs/FLUX.1-schnell-Free`    |

<Note>
  Please see the [Together.ai models
  page](https://docs.together.ai/docs/serverless-models#image-models) for a full
  list of available image models and their capabilities.
</Note>

