# DevTools

<Note type="warning">
  AI SDK DevTools is experimental and intended for local development only. Do
  not use in production environments.
</Note>

AI SDK DevTools gives you full visibility over your AI SDK calls with [`generateText`](/docs/reference/ai-sdk-core/generate-text), [`streamText`](/docs/reference/ai-sdk-core/stream-text), and [`ToolLoopAgent`](/docs/reference/ai-sdk-core/tool-loop-agent). It helps you debug and inspect LLM requests, responses, tool calls, and multi-step interactions through a web-based UI.

DevTools is composed of two parts:

1. **Middleware**: Captures runs and steps from your AI SDK calls
2. **Viewer**: A web UI to inspect the captured data

