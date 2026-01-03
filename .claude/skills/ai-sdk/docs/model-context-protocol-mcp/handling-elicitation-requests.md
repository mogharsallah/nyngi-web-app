## Handling Elicitation Requests

Elicitation is a mechanism where MCP servers can request additional information from the client during tool execution. For example, a server might need user input to complete a registration form or confirmation for a sensitive operation.

<Note type="warning">
  It is up to the client application to handle elicitation requests properly.
  The MCP client simply surfaces these requests from the server to your
  application code.
</Note>

### Enabling Elicitation Support

To enable elicitation, you need to advertise the capability when creating the MCP client:

```typescript
const mcpClient = await createMCPClient({
  transport: {
    type: 'sse',
    url: 'https://your-server.com/sse',
  },
  capabilities: {
    elicitation: {},
  },
});
```

### Registering an Elicitation Handler

Use the `onElicitationRequest` method to register a handler that will be called when the server requests input:

```typescript
import { ElicitationRequestSchema } from '@ai-sdk/mcp';

mcpClient.onElicitationRequest(ElicitationRequestSchema, async request => {
  // request.params.message: A message describing what input is needed
  // request.params.requestedSchema: JSON schema defining the expected input structure

  // Get input from the user (implement according to your application's needs)
  const userInput = await getInputFromUser(
    request.params.message,
    request.params.requestedSchema,
  );

  // Return the result with one of three actions:
  return {
    action: 'accept', // or 'decline' or 'cancel'
    content: userInput, // only required when action is 'accept'
  };
});
```

### Elicitation Response Actions

Your handler must return an object with an `action` field that can be one of:

- `'accept'`: User provided the requested information. Must include `content` with the data.
- `'decline'`: User chose not to provide the information.
- `'cancel'`: User cancelled the operation entirely.

