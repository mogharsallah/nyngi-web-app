## Image Models

You can create DeepInfra image models using the `.image()` factory method.
For more on image generation with the AI SDK see [generateImage()](/docs/reference/ai-sdk-core/generate-image).

```ts
import { deepinfra } from '@ai-sdk/deepinfra';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: deepinfra.image('stabilityai/sd3.5'),
  prompt: 'A futuristic cityscape at sunset',
  aspectRatio: '16:9',
});
```

<Note>
  Model support for `size` and `aspectRatio` parameters varies by model. Please
  check the individual model documentation on [DeepInfra's models
  page](https://deepinfra.com/models/text-to-image) for supported options and
  additional parameters.
</Note>

### Model-specific options

You can pass model-specific parameters using the `providerOptions.deepinfra` field:

```ts
import { deepinfra } from '@ai-sdk/deepinfra';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: deepinfra.image('stabilityai/sd3.5'),
  prompt: 'A futuristic cityscape at sunset',
  aspectRatio: '16:9',
  providerOptions: {
    deepinfra: {
      num_inference_steps: 30, // Control the number of denoising steps (1-50)
    },
  },
});
```

### Image Editing

DeepInfra supports image editing through models like `Qwen/Qwen-Image-Edit`. Pass input images via `prompt.images` to transform or edit existing images.

#### Basic Image Editing

Transform an existing image using text prompts:

```ts
const imageBuffer = readFileSync('./input-image.png');

const { images } = await generateImage({
  model: deepinfra.image('Qwen/Qwen-Image-Edit'),
  prompt: {
    text: 'Turn the cat into a golden retriever dog',
    images: [imageBuffer],
  },
  size: '1024x1024',
});
```

#### Inpainting with Mask

Edit specific parts of an image using a mask. Transparent areas in the mask indicate where the image should be edited:

```ts
const image = readFileSync('./input-image.png');
const mask = readFileSync('./mask.png');

const { images } = await generateImage({
  model: deepinfra.image('Qwen/Qwen-Image-Edit'),
  prompt: {
    text: 'A sunlit indoor lounge area with a pool containing a flamingo',
    images: [image],
    mask: mask,
  },
});
```

#### Multi-Image Combining

Combine multiple reference images into a single output:

```ts
const cat = readFileSync('./cat.png');
const dog = readFileSync('./dog.png');

const { images } = await generateImage({
  model: deepinfra.image('Qwen/Qwen-Image-Edit'),
  prompt: {
    text: 'Create a scene with both animals together, playing as friends',
    images: [cat, dog],
  },
});
```

<Note>
  Input images can be provided as `Buffer`, `ArrayBuffer`, `Uint8Array`, or
  base64-encoded strings. DeepInfra uses an OpenAI-compatible image editing API
  at `https://api.deepinfra.com/v1/openai/images/edits`.
</Note>

### Model Capabilities

For models supporting aspect ratios, the following ratios are typically supported:
`1:1 (default), 16:9, 1:9, 3:2, 2:3, 4:5, 5:4, 9:16, 9:21`

For models supporting size parameters, dimensions must typically be:

- Multiples of 32
- Width and height between 256 and 1440 pixels
- Default size is 1024x1024

| Model                              | Dimensions Specification | Notes                                                    |
| ---------------------------------- | ------------------------ | -------------------------------------------------------- |
| `stabilityai/sd3.5`                | Aspect Ratio             | Premium quality base model, 8B parameters                |
| `black-forest-labs/FLUX-1.1-pro`   | Size                     | Latest state-of-art model with superior prompt following |
| `black-forest-labs/FLUX-1-schnell` | Size                     | Fast generation in 1-4 steps                             |
| `black-forest-labs/FLUX-1-dev`     | Size                     | Optimized for anatomical accuracy                        |
| `black-forest-labs/FLUX-pro`       | Size                     | Flagship Flux model                                      |
| `stabilityai/sd3.5-medium`         | Aspect Ratio             | Balanced 2.5B parameter model                            |
| `stabilityai/sdxl-turbo`           | Aspect Ratio             | Optimized for fast generation                            |

For more details and pricing information, see the [DeepInfra text-to-image models page](https://deepinfra.com/models/text-to-image).

