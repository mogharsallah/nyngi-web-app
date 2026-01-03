## Using MCP Prompts

<Note type="warning">
  MCP Prompts is an experimental feature and may change in the future.
</Note>

According to the MCP specification, prompts are user-controlled templates that servers expose for clients to list and retrieve with optional arguments.

### Listing Prompts

```typescript
const prompts = await mcpClient.experimental_listPrompts();
```

### Getting a Prompt

Retrieve prompt messages, optionally passing arguments defined by the server:

```typescript
const prompt = await mcpClient.experimental_getPrompt({
  name: 'code_review',
  arguments: { code: 'function add(a, b) { return a + b; }' },
});
```

