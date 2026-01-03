## Checking for this Error

You can check if an error is an instance of `AI_NoImageGeneratedError` using:

```typescript
import { generateImage, NoImageGeneratedError } from 'ai';

try {
  await generateImage({ model, prompt });
} catch (error) {
  if (NoImageGeneratedError.isInstance(error)) {
    console.log('NoImageGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Responses:', error.responses);
  }
}
```

---
title: AI_NoObjectGeneratedError
description: Learn how to fix AI_NoObjectGeneratedError
---

