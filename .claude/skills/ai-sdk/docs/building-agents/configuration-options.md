## Configuration Options

The Agent class accepts all the same settings as `generateText` and `streamText`. Configure:

### Model and System Instructions

```ts
import { ToolLoopAgent } from 'ai';
__PROVIDER_IMPORT__;

const agent = new ToolLoopAgent({
  model: __MODEL__,
  instructions: 'You are an expert software engineer.',
});
```

### Tools

Provide tools that the agent can use to accomplish tasks:

```ts
import { ToolLoopAgent, tool } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const codeAgent = new ToolLoopAgent({
  model: __MODEL__,
  tools: {
    runCode: tool({
      description: 'Execute Python code',
      inputSchema: z.object({
        code: z.string(),
      }),
      execute: async ({ code }) => {
        // Execute code and return result
        return { output: 'Code executed successfully' };
      },
    }),
  },
});
```

### Loop Control

By default, agents run for 20 steps (`stopWhen: stepCountIs(20)`). In each step, the model either generates text or calls a tool. If it generates text, the agent completes. If it calls a tool, the AI SDK executes that tool.

To let agents call multiple tools in sequence, configure `stopWhen` to allow more steps. After each tool execution, the agent triggers a new generation where the model can call another tool or generate text:

```ts
import { ToolLoopAgent, stepCountIs } from 'ai';
__PROVIDER_IMPORT__;

const agent = new ToolLoopAgent({
  model: __MODEL__,
  stopWhen: stepCountIs(20), // Allow up to 20 steps
});
```

Each step represents one generation (which results in either text or a tool call). The loop continues until:

- A finish reasoning other than tool-calls is returned, or
- A tool that is invoked does not have an execute function, or
- A tool call needs approval, or
- A stop condition is met

You can combine multiple conditions:

```ts
import { ToolLoopAgent, stepCountIs } from 'ai';
__PROVIDER_IMPORT__;

const agent = new ToolLoopAgent({
  model: __MODEL__,
  stopWhen: [
    stepCountIs(20), // Maximum 20 steps
    yourCustomCondition(), // Custom logic for when to stop
  ],
});
```

Learn more about [loop control and stop conditions](/docs/agents/loop-control).

### Tool Choice

Control how the agent uses tools:

```ts
import { ToolLoopAgent } from 'ai';
__PROVIDER_IMPORT__;

const agent = new ToolLoopAgent({
  model: __MODEL__,
  tools: {
    // your tools here
  },
  toolChoice: 'required', // Force tool use
  // or toolChoice: 'none' to disable tools
  // or toolChoice: 'auto' (default) to let the model decide
});
```

You can also force the use of a specific tool:

```ts
import { ToolLoopAgent } from 'ai';
__PROVIDER_IMPORT__;

const agent = new ToolLoopAgent({
  model: __MODEL__,
  tools: {
    weather: weatherTool,
    cityAttractions: attractionsTool,
  },
  toolChoice: {
    type: 'tool',
    toolName: 'weather', // Force the weather tool to be used
  },
});
```

### Structured Output

Define structured output schemas:

```ts
import { ToolLoopAgent, Output, stepCountIs } from 'ai';
__PROVIDER_IMPORT__;
import { z } from 'zod';

const analysisAgent = new ToolLoopAgent({
  model: __MODEL__,
  output: Output.object({
    schema: z.object({
      sentiment: z.enum(['positive', 'neutral', 'negative']),
      summary: z.string(),
      keyPoints: z.array(z.string()),
    }),
  }),
  stopWhen: stepCountIs(10),
});

const { output } = await analysisAgent.generate({
  prompt: 'Analyze customer feedback from the last quarter',
});
```

