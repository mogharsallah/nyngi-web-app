## Initializing an MCP Client

We recommend using HTTP transport (like `StreamableHTTPClientTransport`) for production deployments. The stdio transport should only be used for connecting to local servers as it cannot be deployed to production environments.

Create an MCP client using one of the following transport options:

- **HTTP transport (Recommended)**: Either configure HTTP directly via the client using `transport: { type: 'http', ... }`, or use MCP's official TypeScript SDK `StreamableHTTPClientTransport`
- SSE (Server-Sent Events): An alternative HTTP-based transport
- `stdio`: For local development only. Uses standard input/output streams for local MCP servers

### HTTP Transport (Recommended)

For production deployments, we recommend using the HTTP transport. You can configure it directly on the client:

```typescript
import { createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'http',
    url: 'https://your-server.com/mcp',

    // optional: configure HTTP headers
    headers: { Authorization: 'Bearer my-api-key' },

    // optional: provide an OAuth client provider for automatic authorization
    authProvider: myOAuthClientProvider,
  },
});
```

Alternatively, you can use `StreamableHTTPClientTransport` from MCP's official TypeScript SDK:

```typescript
import { createMCPClient } from '@ai-sdk/mcp';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const url = new URL('https://your-server.com/mcp');
const mcpClient = await createMCPClient({
  transport: new StreamableHTTPClientTransport(url, {
    sessionId: 'session_123',
  }),
});
```

### SSE Transport

SSE provides an alternative HTTP-based transport option. Configure it with a `type` and `url` property. You can also provide an `authProvider` for OAuth:

```typescript
import { createMCPClient } from '@ai-sdk/mcp';

const mcpClient = await createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://my-server.com/sse',

    // optional: configure HTTP headers
    headers: { Authorization: 'Bearer my-api-key' },

    // optional: provide an OAuth client provider for automatic authorization
    authProvider: myOAuthClientProvider,
  },
});
```

### Stdio Transport (Local Servers)

<Note type="warning">
  The stdio transport should only be used for local servers.
</Note>

The Stdio transport can be imported from either the MCP SDK or the AI SDK:

```typescript
import { createMCPClient } from '@ai-sdk/mcp';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
// Or use the AI SDK's stdio transport:
// import { Experimental_StdioMCPTransport as StdioClientTransport } from '@ai-sdk/mcp/mcp-stdio';

const mcpClient = await createMCPClient({
  transport: new StdioClientTransport({
    command: 'node',
    args: ['src/stdio/dist/server.js'],
  }),
});
```

### Custom Transport

You can also bring your own transport by implementing the `MCPTransport` interface for specific requirements not covered by the standard transports.

<Note>
  The client returned by the `createMCPClient` function is a
  lightweight client intended for use in tool conversion. It currently does not
  support all features of the full MCP client, such as: session
  management, resumable streams, and receiving notifications.

Authorization via OAuth is supported when using the AI SDK MCP HTTP or SSE
transports by providing an `authProvider`.

</Note>

### Closing the MCP Client

After initialization, you should close the MCP client based on your usage pattern:

- For short-lived usage (e.g., single requests), close the client when the response is finished
- For long-running clients (e.g., command line apps), keep the client open but ensure it's closed when the application terminates

When streaming responses, you can close the client when the LLM response has finished. For example, when using `streamText`, you should use the `onFinish` callback:

```typescript
const mcpClient = await createMCPClient({
  // ...
});

const tools = await mcpClient.tools();

const result = await streamText({
  model: __MODEL__,
  tools,
  prompt: 'What is the weather in Brooklyn, New York?',
  onFinish: async () => {
    await mcpClient.close();
  },
});
```

When generating responses without streaming, you can use try/finally or cleanup functions in your framework:

```typescript
let mcpClient: MCPClient | undefined;

try {
  mcpClient = await createMCPClient({
    // ...
  });
} finally {
  await mcpClient?.close();
}
```

