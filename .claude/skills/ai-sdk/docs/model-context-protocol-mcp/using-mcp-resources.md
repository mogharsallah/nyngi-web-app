## Using MCP Resources

According to the [MCP specification](https://modelcontextprotocol.io/docs/learn/server-concepts#resources), resources are **application-driven** data sources that provide context to the model. Unlike tools (which are model-controlled), your application decides when to fetch and pass resources as context.

The MCP client provides three methods for working with resources:

### Listing Resources

List all available resources from the MCP server:

```typescript
const resources = await mcpClient.listResources();
```

### Reading Resource Contents

Read the contents of a specific resource by its URI:

```typescript
const resourceData = await mcpClient.readResource({
  uri: 'file:///example/document.txt',
});
```

### Listing Resource Templates

Resource templates are dynamic URI patterns that allow flexible queries. List all available templates:

```typescript
const templates = await mcpClient.listResourceTemplates();
```

