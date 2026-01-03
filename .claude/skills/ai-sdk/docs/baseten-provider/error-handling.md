## Error Handling

The Baseten provider includes built-in error handling for common API errors:

```ts
import { baseten } from '@ai-sdk/baseten';
import { generateText } from 'ai';

try {
  const { text } = await generateText({
    model: baseten('moonshotai/Kimi-K2-Instruct-0905'),
    prompt: 'Hello, world!',
  });
} catch (error) {
  console.error('Baseten API error:', error.message);
}
```

### Common Error Scenarios

```ts
// Embeddings require a modelURL
try {
  baseten.embeddingModel();
} catch (error) {
  // Error: "No model URL provided for embeddings. Please set modelURL option for embeddings."
}

// /predict endpoints are not supported for chat models
try {
  const baseten = createBaseten({
    modelURL:
      'https://model-{MODEL_ID}.api.baseten.co/environments/production/predict',
  });
  baseten(); // This will throw an error
} catch (error) {
  // Error: "Not supported. You must use a /sync/v1 endpoint for chat models."
}

// /sync/v1 endpoints are now supported for embeddings
const baseten = createBaseten({
  modelURL:
    'https://model-{MODEL_ID}.api.baseten.co/environments/production/sync/v1',
});
const embeddingModel = baseten.embeddingModel(); // This works fine!

// /predict endpoints are not supported for embeddings
try {
  const baseten = createBaseten({
    modelURL:
      'https://model-{MODEL_ID}.api.baseten.co/environments/production/predict',
  });
  baseten.embeddingModel(); // This will throw an error
} catch (error) {
  // Error: "Not supported. You must use a /sync or /sync/v1 endpoint for embeddings."
}

// Image models are not supported
try {
  baseten.imageModel('test-model');
} catch (error) {
  // Error: NoSuchModelError for imageModel
}
```

<Note>
  For more information about Baseten models and deployment options, see the
  [Baseten documentation](https://docs.baseten.co/).
</Note>

---
title: Hugging Face
description: Learn how to use Hugging Face Provider.
---

