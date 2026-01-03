## Creating an Agent

Define an agent by instantiating the ToolLoopAgent class with your desired configuration:

```ts
import { ToolLoopAgent } from 'ai';
__PROVIDER_IMPORT__;

const myAgent = new ToolLoopAgent({
  model: __MODEL__,
  instructions: 'You are a helpful assistant.',
  tools: {
    // Your tools here
  },
});
```

