## Image Models

You can create Fal image models using the `.image()` factory method.
For more on image generation with the AI SDK see [generateImage()](/docs/reference/ai-sdk-core/generate-image).

### Basic Usage

```ts
import { fal } from '@ai-sdk/fal';
import { generateImage } from 'ai';
import fs from 'fs';

const { image, providerMetadata } = await generateImage({
  model: fal.image('fal-ai/flux/dev'),
  prompt: 'A serene mountain landscape at sunset',
});

const filename = `image-${Date.now()}.png`;
fs.writeFileSync(filename, image.uint8Array);
console.log(`Image saved to ${filename}`);
```

Fal image models may return additional information for the images and the request.

Here are some examples of properties that may be set for each image

```js
providerMetadata.fal.images[0].nsfw; // boolean, image is not safe for work
providerMetadata.fal.images[0].width; // number, image width
providerMetadata.fal.images[0].height; // number, image height
providerMetadata.fal.images[0].content_type; // string, mime type of the image
```

### Model Capabilities

Fal offers many models optimized for different use cases. Here are a few popular examples. For a full list of models, see the [Fal AI Search Page](https://fal.ai/explore/search).

| Model                                          | Description                                                                                                                       |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `fal-ai/flux/dev`                              | FLUX.1 [dev] model for high-quality image generation                                                                              |
| `fal-ai/flux-pro/kontext`                      | FLUX.1 Kontext [pro] handles both text and reference images as inputs, enabling targeted edits and complex transformations        |
| `fal-ai/flux-pro/kontext/max`                  | FLUX.1 Kontext [max] with improved prompt adherence and typography generation                                                     |
| `fal-ai/flux-lora`                             | Super fast endpoint for FLUX.1 with LoRA support                                                                                  |
| `fal-ai/ideogram/character`                    | Generate consistent character appearances across multiple images. Maintain facial features, proportions, and distinctive traits   |
| `fal-ai/qwen-image`                            | Qwen-Image foundation model with significant advances in complex text rendering and precise image editing                         |
| `fal-ai/omnigen-v2`                            | Unified image generation model for Image Editing, Personalized Image Generation, Virtual Try-On, Multi Person Generation and more |
| `fal-ai/bytedance/dreamina/v3.1/text-to-image` | Dreamina showcases superior picture effects with improvements in aesthetics, precise and diverse styles, and rich details         |
| `fal-ai/recraft/v3/text-to-image`              | SOTA in image generation with vector art and brand style capabilities                                                             |
| `fal-ai/wan/v2.2-a14b/text-to-image`           | High-resolution, photorealistic images with fine-grained detail                                                                   |

Fal models support the following aspect ratios:

- 1:1 (square HD)
- 16:9 (landscape)
- 9:16 (portrait)
- 4:3 (landscape)
- 3:4 (portrait)
- 16:10 (1280x800)
- 10:16 (800x1280)
- 21:9 (2560x1080)
- 9:21 (1080x2560)

Key features of Fal models include:

- Up to 4x faster inference speeds compared to alternatives
- Optimized by the Fal Inference Engine™
- Support for real-time infrastructure
- Cost-effective scaling with pay-per-use pricing
- LoRA training capabilities for model personalization

#### Modify Image

Transform existing images using text prompts.

```ts
await generateImage({
  model: fal.image('fal-ai/flux-pro/kontext/max'),
  prompt: {
    text: 'Put a donut next to the flour.',
    images: [
      'https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png',
    ],
  },
});
```

Images can also be passed as base64-encoded string, a `Uint8Array`, an `ArrayBuffer`, or a `Buffer`.
A mask can be passed as well

```ts
await generateImage({
  model: fal.image('fal-ai/flux-pro/kontext/max'),
  prompt: {
    text: 'Put a donut next to the flour.',
    images: [imageBuffer],
    mask: maskBuffer,
  },
});
```

### Provider Options

Fal image models support flexible provider options through the `providerOptions.fal` object. You can pass any parameters supported by the specific Fal model's API. Common options include:

- **imageUrl** - Reference image URL for image-to-image generation
- **strength** - Controls how much the output differs from the input image
- **guidanceScale** - Controls adherence to the prompt (range: 1-20)
- **numInferenceSteps** - Number of denoising steps (range: 1-50)
- **enableSafetyChecker** - Enable/disable safety filtering
- **outputFormat** - Output format: 'jpeg' or 'png'
- **syncMode** - Wait for completion before returning response
- **acceleration** - Speed of generation: 'none', 'regular', or 'high'
- **safetyTolerance** - Content safety filtering level (1-6, where 1 is strictest)

<Note type="warning">
  **Deprecation Notice**: snake_case parameter names (e.g., `image_url`,
  `guidance_scale`) are deprecated and will be removed in `@ai-sdk/fal` v2.0.
  Please use camelCase names (e.g., `imageUrl`, `guidanceScale`) instead.
</Note>

Refer to the [Fal AI model documentation](https://fal.ai/models) for model-specific parameters.

### Advanced Features

Fal's platform offers several advanced capabilities:

- **Private Model Inference**: Run your own diffusion transformer models with up to 50% faster inference
- **LoRA Training**: Train and personalize models in under 5 minutes
- **Real-time Infrastructure**: Enable new user experiences with fast inference times
- **Scalable Architecture**: Scale to thousands of GPUs when needed

For more details about Fal's capabilities and features, visit the [Fal AI documentation](https://fal.ai/docs).

