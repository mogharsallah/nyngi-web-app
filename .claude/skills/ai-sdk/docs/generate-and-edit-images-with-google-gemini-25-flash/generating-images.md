## Generating Images

As Gemini 2.5 Flash Image is a language model with multimodal capabilities, you can use the `generateText` or `streamText` functions (not `generateImage`) to create images. The model determines which modality to respond in based on your prompt and configuration. Here's how to create your first image:

```ts
import { generateText } from 'ai';
import fs from 'node:fs';
import 'dotenv/config';

async function generateImage() {
  const result = await generateText({
    model: 'google/gemini-2.5-flash-image',
    prompt:
      'Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme',
  });

  // Save generated images
  for (const file of result.files) {
    if (file.mediaType.startsWith('image/')) {
      const timestamp = Date.now();
      const fileName = `generated-${timestamp}.png`;

      fs.mkdirSync('output', { recursive: true });
      await fs.promises.writeFile(`output/${fileName}`, file.uint8Array);

      console.log(`Generated and saved image: output/${fileName}`);
    }
  }
}

generateImage().catch(console.error);
```

Here are some key points to remember:

- Generated images are returned in the `result.files` array
- Images are returned as `Uint8Array` data
- The model leverages Gemini's world knowledge, so detailed prompts yield better results

