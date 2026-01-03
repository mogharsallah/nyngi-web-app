## Getting Started with the AI SDK

<Note>
  If you have never used the AI SDK before, start by following the [Getting
  Started guide](/docs/getting-started).
</Note>

<Note>
  For a working example of Computer Use implementation with Next.js and the AI
  SDK, check out our [AI SDK Computer Use
  Template](https://github.com/vercel-labs/ai-sdk-computer-use).
</Note>

First, ensure you have the AI SDK and [Anthropic AI SDK provider](/providers/ai-sdk-providers/anthropic) installed:

<Snippet text="pnpm add ai @ai-sdk/anthropic" />

You can add Computer Use to your AI SDK applications using provider-defined-client tools. These tools accept various input parameters (like display height and width in the case of the computer tool) and then require that you define an execute function.

Here's how you could set up the Computer Tool with the AI SDK:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { getScreenshot, executeComputerAction } from '@/utils/computer-use';

const computerTool = anthropic.tools.computer_20250124({
  displayWidthPx: 1920,
  displayHeightPx: 1080,
  execute: async ({ action, coordinate, text }) => {
    switch (action) {
      case 'screenshot': {
        return {
          type: 'image',
          data: getScreenshot(),
        };
      }
      default: {
        return executeComputerAction(action, coordinate, text);
      }
    }
  },
  toModelOutput({ output }) {
    return typeof output === 'string'
      ? [{ type: 'text', text: output }]
      : [{ type: 'image', data: output.data, mediaType: 'image/png' }];
  },
});
```

The `computerTool` handles two main actions: taking screenshots via `getScreenshot()` and executing computer actions like mouse movements and clicks through `executeComputerAction()`. Remember, you have to implement this execution logic (eg. the `getScreenshot` and `executeComputerAction` functions) to handle the actual computer interactions. The `execute` function should handle all low-level interactions with the operating system.

Finally, to send tool results back to the model, use the [`toModelOutput()`](/docs/foundations/prompts#multi-modal-tool-results) function to convert text and image responses into a format the model can process. The AI SDK includes experimental support for these multi-modal tool results when using Anthropic's models.

<Note>
  Computer Use requires appropriate safety measures like using virtual machines,
  limiting access to sensitive data, and implementing human oversight for
  critical actions.
</Note>

### Using Computer Tools with Text Generation

Once your tool is defined, you can use it with both the [`generateText`](/docs/reference/ai-sdk-core/generate-text) and [`streamText`](/docs/reference/ai-sdk-core/stream-text) functions.

For one-shot text generation, use `generateText`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4-20250514',
  prompt: 'Move the cursor to the center of the screen and take a screenshot',
  tools: { computer: computerTool },
});

console.log(result.text);
```

For streaming responses, use `streamText` to receive updates in real-time:

```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4-20250514',
  prompt: 'Open the browser and navigate to vercel.com',
  tools: { computer: computerTool },
});

for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

### Configure Multi-Step (Agentic) Generations

To allow the model to perform multiple steps without user intervention, use the `stopWhen` parameter. This will automatically send any tool results back to the model to trigger a subsequent generation:

```ts highlight="1,7"
import { stepCountIs } from 'ai';

const stream = streamText({
  model: 'anthropic/claude-sonnet-4-20250514',
  prompt: 'Open the browser and navigate to vercel.com',
  tools: { computer: computerTool },
  stopWhen: stepCountIs(10), // experiment with this value based on your use case
});
```

### Combine Multiple Tools

You can combine multiple tools in a single request to enable more complex workflows. The AI SDK supports all three of Claude's Computer Use tools:

```ts
const computerTool = anthropic.tools.computer_20250124({
  ...
});

const bashTool = anthropic.tools.bash_20250124({
  execute: async ({ command, restart }) => execSync(command).toString()
});

const textEditorTool = anthropic.tools.textEditor_20250124({
  execute: async ({
    command,
    path,
    file_text,
    insert_line,
    new_str,
    old_str,
    view_range
  }) => {
    // Handle file operations based on command
    switch(command) {
      return executeTextEditorFunction({
        command,
        path,
        fileText: file_text,
        insertLine: insert_line,
        newStr: new_str,
        oldStr: old_str,
        viewRange: view_range
      });
    }
  }
});


const response = await generateText({
  model: 'anthropic/claude-sonnet-4-20250514',
  prompt: "Create a new file called example.txt, write 'Hello World' to it, and run 'cat example.txt' in the terminal",
  tools: {
    computer: computerTool,
    bash: bashTool,
    str_replace_editor: textEditorTool,
  },
});
```

<Note>
  Always implement appropriate [security measures](#security-measures) and
  obtain user consent before enabling Computer Use in production applications.
</Note>

### Best Practices for Computer Use

To get the best results when using Computer Use:

1. Specify simple, well-defined tasks with explicit instructions for each step
2. Prompt Claude to verify outcomes through screenshots
3. Use keyboard shortcuts when UI elements are difficult to manipulate
4. Include example screenshots for repeatable tasks
5. Provide explicit tips in system prompts for known tasks

