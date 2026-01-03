## How It Works

Computer Use enables the model to read and interact with on-screen content through a series of coordinated steps. Here's how the process works:

1. **Start with a prompt and tools**

   Add Anthropic-defined Computer Use tools to your request and provide a task (prompt) for the model. For example: "save an image to your downloads folder."

2. **Select the right tool**

   The model evaluates which computer tools can help accomplish the task. It then sends a formatted `tool_call` to use the appropriate tool.

3. **Execute the action and return results**

   The AI SDK processes Claude's request by running the selected tool. The results can then be sent back to Claude through a `tool_result` message.

4. **Complete the task through iterations**

   Claude analyzes each result to determine if more actions are needed. It continues requesting tool use and processing results until it completes your task or requires additional input.

### Available Tools

There are three main tools available in the Computer Use API:

1. **Computer Tool**: Enables basic computer control like mouse movement, clicking, and keyboard input
2. **Text Editor Tool**: Provides functionality for viewing and editing text files
3. **Bash Tool**: Allows execution of bash commands

### Implementation Considerations

Computer Use tools in the AI SDK are predefined interfaces that require your own implementation of the execution layer. While the SDK provides the type definitions and structure for these tools, you need to:

1. Set up a controlled environment for Computer Use execution
2. Implement core functionality like mouse control and keyboard input
3. Handle screenshot capture and processing
4. Set up rules and limits for how Claude can interact with your system

The recommended approach is to start with [ Anthropic's reference implementation ](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo), which provides:

- A containerized environment configured for safe Computer Use
- Ready-to-use (Python) implementations of Computer Use tools
- An agent loop for API interaction and tool execution
- A web interface for monitoring and control

This reference implementation serves as a foundation to understand the requirements before building your own custom solution.

