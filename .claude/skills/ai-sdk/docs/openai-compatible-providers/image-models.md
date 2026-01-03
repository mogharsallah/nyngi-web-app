## Image Models

You can create image models using the `.imageModel()` factory method:

```ts
const model = provider.imageModel('model-id');
```

### Basic Image Generation

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateImage } from 'ai';

const provider = createOpenAICompatible({
  name: 'provider-name',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.provider.com/v1',
});

const { images } = await generateImage({
  model: provider.imageModel('model-id'),
  prompt: 'A futuristic cityscape at sunset',
  size: '1024x1024',
});
```

### Image Editing

The OpenAI Compatible provider supports image editing through the `/images/edits` endpoint. Pass input images via `prompt.images` to transform or edit existing images.

#### Basic Image Editing

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateImage } from 'ai';
import fs from 'fs';

const provider = createOpenAICompatible({
  name: 'provider-name',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.provider.com/v1',
});

const imageBuffer = fs.readFileSync('./input-image.png');

const { images } = await generateImage({
  model: provider.imageModel('model-id'),
  prompt: {
    text: 'Turn the cat into a dog but retain the style of the original image',
    images: [imageBuffer],
  },
});
```

#### Inpainting with Mask

Edit specific parts of an image using a mask:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateImage } from 'ai';
import fs from 'fs';

const provider = createOpenAICompatible({
  name: 'provider-name',
  apiKey: process.env.PROVIDER_API_KEY,
  baseURL: 'https://api.provider.com/v1',
});

const image = fs.readFileSync('./input-image.png');
const mask = fs.readFileSync('./mask.png');

const { images } = await generateImage({
  model: provider.imageModel('model-id'),
  prompt: {
    text: 'A sunlit indoor lounge area with a pool containing a flamingo',
    images: [image],
    mask,
  },
});
```

<Note>
  Input images can be provided as `Buffer`, `ArrayBuffer`, `Uint8Array`,
  base64-encoded strings, or URLs. The provider will automatically download
  URL-based images and convert them to the appropriate format.
</Note>

