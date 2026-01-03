## Enum Output Mode

When you need to classify or categorize input into predefined options, you can use the `enum` output mode with `useObject`. This requires a specific schema structure where the object has `enum` as a key with `z.enum` containing your possible values.

### Example: Text Classification

This example shows how to build a simple text classifier that categorizes statements as true or false.

#### Client

When using `useObject` with enum output mode, your schema must be an object with `enum` as the key:

```tsx filename='app/classify/page.tsx'
'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';

export default function ClassifyPage() {
  const { object, submit, isLoading } = useObject({
    api: '/api/classify',
    schema: z.object({ enum: z.enum(['true', 'false']) }),
  });

  return (
    <>
      <button onClick={() => submit('The earth is flat')} disabled={isLoading}>
        Classify statement
      </button>

      {object && <div>Classification: {object.enum}</div>}
    </>
  );
}
```

#### Server

On the server, use `streamText` with `Output.choice()` to stream the classification result:

```typescript filename='app/api/classify/route.ts'
import { streamText, Output } from 'ai';
__PROVIDER_IMPORT__;

export async function POST(req: Request) {
  const context = await req.json();

  const result = streamText({
    model: __MODEL__,
    output: Output.choice({ options: ['true', 'false'] }),
    prompt: `Classify this statement as true or false: ${context}`,
  });

  return result.toTextStreamResponse();
}
```

