## Active Tools

Language models can only handle a limited number of tools at a time, depending on the model.
To allow for static typing using a large number of tools and limiting the available tools to the model at the same time,
the AI SDK provides the `activeTools` property.

It is an array of tool names that are currently active.
By default, the value is `undefined` and all tools are active.

```ts highlight="7"
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
__PROVIDER_IMPORT__;

const { text } = await generateText({
  model: __MODEL__,
  tools: myToolSet,
  activeTools: ['firstTool'],
});
```

