## Captured data

The DevTools middleware captures the following information from your AI SDK calls:

- **Input parameters and prompts**: View the complete input sent to your LLM
- **Output content and tool calls**: Inspect generated text and tool invocations
- **Token usage and timing**: Monitor resource consumption and performance
- **Raw provider data**: Access complete request and response payloads

### Runs and steps

DevTools organizes captured data into runs and steps:

- **Run**: A complete multi-step AI interaction, grouped by the initial prompt
- **Step**: A single LLM call within a run (e.g., one `generateText` or `streamText` call)

Multi-step interactions, such as those created by tool calling or agent loops, are grouped together as a single run with multiple steps.

