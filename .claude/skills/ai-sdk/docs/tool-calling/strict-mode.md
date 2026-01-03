## Strict Mode

When enabled, language model providers that support strict tool calling will only generate tool calls that are valid according to your defined `inputSchema`.
This increases the reliability of tool calling.
However, not all schemas may be supported in strict mode, and what is supported depends on the specific provider.

By default, strict mode is disabled. You can enable it per-tool by setting `strict: true`:

```ts
tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string(),
  }),
  strict: true, // Enable strict validation for this tool
  execute: async ({ location }) => ({
    // ...
  }),
});
```

<Note>
  Not all providers or models support strict mode. For those that do not, this
  option is ignored.
</Note>

