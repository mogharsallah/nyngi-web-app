## Input Examples

You can specify example inputs for your tools to help guide the model on how input data should be structured.
When supported by providers, input examples can help when JSON schema itself does not fully specify the intended
usage or when there are optional values.

```ts
tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  inputExamples: [
    { input: { location: 'San Francisco' } },
    { input: { location: 'London' } },
  ],
  execute: async ({ location }) => {
    // ...
  },
});
```

<Note>
  Only the Anthropic providers supports tool input examples natively. Other
  providers ignore the setting.
</Note>

