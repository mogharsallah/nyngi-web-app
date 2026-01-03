# Chatbot Tool Usage

With [`useChat`](/docs/reference/ai-sdk-ui/use-chat) and [`streamText`](/docs/reference/ai-sdk-core/stream-text), you can use tools in your chatbot application.
The AI SDK supports three types of tools in this context:

1. Automatically executed server-side tools
2. Automatically executed client-side tools
3. Tools that require user interaction, such as confirmation dialogs

The flow is as follows:

1. The user enters a message in the chat UI.
1. The message is sent to the API route.
1. In your server side route, the language model generates tool calls during the `streamText` call.
1. All tool calls are forwarded to the client.
1. Server-side tools are executed using their `execute` method and their results are forwarded to the client.
1. Client-side tools that should be automatically executed are handled with the `onToolCall` callback.
   You must call `addToolOutput` to provide the tool result.
1. Client-side tool that require user interactions can be displayed in the UI.
   The tool calls and results are available as tool invocation parts in the `parts` property of the last assistant message.
1. When the user interaction is done, `addToolOutput` can be used to add the tool result to the chat.
1. The chat can be configured to automatically submit when all tool results are available using `sendAutomaticallyWhen`.
   This triggers another iteration of this flow.

The tool calls and tool executions are integrated into the assistant message as typed tool parts.
A tool part is at first a tool call, and then it becomes a tool result when the tool is executed.
The tool result contains all information about the tool call as well as the result of the tool execution.

<Note>
  Tool result submission can be configured using the `sendAutomaticallyWhen`
  option. You can use the `lastAssistantMessageIsCompleteWithToolCalls` helper
  to automatically submit when all tool results are available. This simplifies
  the client-side code while still allowing full control when needed.
</Note>

