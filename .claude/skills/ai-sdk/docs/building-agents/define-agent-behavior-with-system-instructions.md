## Define Agent Behavior with System Instructions

System instructions define your agent's behavior, personality, and constraints. They set the context for all interactions and guide how the agent responds to user queries and uses tools.

### Basic System Instructions

Set the agent's role and expertise:

```ts
const agent = new ToolLoopAgent({
  model: __MODEL__,
  instructions:
    'You are an expert data analyst. You provide clear insights from complex data.',
});
```

### Detailed Behavioral Instructions

Provide specific guidelines for agent behavior:

```ts
const codeReviewAgent = new ToolLoopAgent({
  model: __MODEL__,
  instructions: `You are a senior software engineer conducting code reviews.

  Your approach:
  - Focus on security vulnerabilities first
  - Identify performance bottlenecks
  - Suggest improvements for readability and maintainability
  - Be constructive and educational in your feedback
  - Always explain why something is an issue and how to fix it`,
});
```

### Constrain Agent Behavior

Set boundaries and ensure consistent behavior:

```ts
const customerSupportAgent = new ToolLoopAgent({
  model: __MODEL__,
  instructions: `You are a customer support specialist for an e-commerce platform.

  Rules:
  - Never make promises about refunds without checking the policy
  - Always be empathetic and professional
  - If you don't know something, say so and offer to escalate
  - Keep responses concise and actionable
  - Never share internal company information`,
  tools: {
    checkOrderStatus,
    lookupPolicy,
    createTicket,
  },
});
```

### Tool Usage Instructions

Guide how the agent should use available tools:

```ts
const researchAgent = new ToolLoopAgent({
  model: __MODEL__,
  instructions: `You are a research assistant with access to search and document tools.

  When researching:
  1. Always start with a broad search to understand the topic
  2. Use document analysis for detailed information
  3. Cross-reference multiple sources before drawing conclusions
  4. Cite your sources when presenting information
  5. If information conflicts, present both viewpoints`,
  tools: {
    webSearch,
    analyzeDocument,
    extractQuotes,
  },
});
```

### Format and Style Instructions

Control the output format and communication style:

```ts
const technicalWriterAgent = new ToolLoopAgent({
  model: __MODEL__,
  instructions: `You are a technical documentation writer.

  Writing style:
  - Use clear, simple language
  - Avoid jargon unless necessary
  - Structure information with headers and bullet points
  - Include code examples where relevant
  - Write in second person ("you" instead of "the user")

  Always format responses in Markdown.`,
});
```

