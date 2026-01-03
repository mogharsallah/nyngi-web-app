## Stop Conditions

The `stopWhen` parameter controls when to stop execution when there are tool results in the last step. By default, agents stop after 20 steps using `stepCountIs(20)`.

When you provide `stopWhen`, the agent continues executing after tool calls until a stopping condition is met. When the condition is an array, execution stops when any of the conditions are met.

### Use Built-in Conditions

The AI SDK provides several built-in stopping conditions:

```ts
import { ToolLoopAgent, stepCountIs } from 'ai';
__PROVIDER_IMPORT__;

const agent = new ToolLoopAgent({
  model: __MODEL__,
  tools: {
    // your tools
  },
  stopWhen: stepCountIs(20), // Default state: stop after 20 steps maximum
});

const result = await agent.generate({
  prompt: 'Analyze this dataset and create a summary report',
});
```

### Combine Multiple Conditions

Combine multiple stopping conditions. The loop stops when it meets any condition:

```ts
import { ToolLoopAgent, stepCountIs, hasToolCall } from 'ai';
__PROVIDER_IMPORT__;

const agent = new ToolLoopAgent({
  model: __MODEL__,
  tools: {
    // your tools
  },
  stopWhen: [
    stepCountIs(20), // Maximum 20 steps
    hasToolCall('someTool'), // Stop after calling 'someTool'
  ],
});

const result = await agent.generate({
  prompt: 'Research and analyze the topic',
});
```

### Create Custom Conditions

Build custom stopping conditions for specific requirements:

```ts
import { ToolLoopAgent, StopCondition, ToolSet } from 'ai';
__PROVIDER_IMPORT__;

const tools = {
  // your tools
} satisfies ToolSet;

const hasAnswer: StopCondition<typeof tools> = ({ steps }) => {
  // Stop when the model generates text containing "ANSWER:"
  return steps.some(step => step.text?.includes('ANSWER:')) ?? false;
};

const agent = new ToolLoopAgent({
  model: __MODEL__,
  tools,
  stopWhen: hasAnswer,
});

const result = await agent.generate({
  prompt: 'Find the answer and respond with "ANSWER: [your answer]"',
});
```

Custom conditions receive step information across all steps:

```ts
const budgetExceeded: StopCondition<typeof tools> = ({ steps }) => {
  const totalUsage = steps.reduce(
    (acc, step) => ({
      inputTokens: acc.inputTokens + (step.usage?.inputTokens ?? 0),
      outputTokens: acc.outputTokens + (step.usage?.outputTokens ?? 0),
    }),
    { inputTokens: 0, outputTokens: 0 },
  );

  const costEstimate =
    (totalUsage.inputTokens * 0.01 + totalUsage.outputTokens * 0.03) / 1000;
  return costEstimate > 0.5; // Stop if cost exceeds $0.50
};
```

