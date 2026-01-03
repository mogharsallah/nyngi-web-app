## Image Models

You can create models that call the Azure OpenAI image generation API (DALL-E) using the `.image()` factory method. The first argument is your deployment name for the DALL-E model.

```ts
const model = azure.image('your-dalle-deployment-name');
```

Azure OpenAI image models support several additional settings. You can pass them as `providerOptions.openai` when generating the image:

```ts
await generateImage({
  model: azure.image('your-dalle-deployment-name'),
  prompt: 'A photorealistic image of a cat astronaut floating in space',
  size: '1024x1024', // '1024x1024', '1792x1024', or '1024x1792' for DALL-E 3
  providerOptions: {
    openai: {
      user: 'test-user', // optional unique user identifier
      responseFormat: 'url', // 'url' or 'b64_json', defaults to 'url'
    },
  },
});
```

### Example

You can use Azure OpenAI image models to generate images with the `generateImage` function:

```ts
import { azure } from '@ai-sdk/azure';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: azure.image('your-dalle-deployment-name'),
  prompt: 'A photorealistic image of a cat astronaut floating in space',
  size: '1024x1024', // '1024x1024', '1792x1024', or '1024x1792' for DALL-E 3
});

// image contains the URL or base64 data of the generated image
console.log(image);
```

### Model Capabilities

Azure OpenAI supports DALL-E 2 and DALL-E 3 models through deployments. The capabilities depend on which model version your deployment is using:

| Model Version | Sizes                           |
| ------------- | ------------------------------- |
| DALL-E 3      | 1024x1024, 1792x1024, 1024x1792 |
| DALL-E 2      | 256x256, 512x512, 1024x1024     |

<Note>
  DALL-E models do not support the `aspectRatio` parameter. Use the `size`
  parameter instead.
</Note>

<Note>
  When creating your Azure OpenAI deployment, make sure to set the DALL-E model
  version you want to use.
</Note>

