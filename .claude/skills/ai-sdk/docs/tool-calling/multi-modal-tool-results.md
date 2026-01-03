## Multi-modal Tool Results

<Note type="warning">
  Multi-modal tool results are experimental and only supported by Anthropic and
  OpenAI.
</Note>

In order to send multi-modal tool results, e.g. screenshots, back to the model,
they need to be converted into a specific format.

AI SDK Core tools have an optional `toModelOutput` function
that converts the tool result into a content part.

Here is an example for converting a screenshot into a content part:

```ts highlight="22-27"
const result = await generateText({
  model: __MODEL__,
  tools: {
    computer: anthropic.tools.computer_20241022({
      // ...
      async execute({ action, coordinate, text }) {
        switch (action) {
          case 'screenshot': {
            return {
              type: 'image',
              data: fs
                .readFileSync('./data/screenshot-editor.png')
                .toString('base64'),
            };
          }
          default: {
            return `executed ${action}`;
          }
        }
      },

      // map to tool result content for LLM consumption:
      toModelOutput({ output }) {
        return {
          type: 'content',
          value:
            typeof output === 'string'
              ? [{ type: 'text', text: output }]
              : [{ type: 'media', data: output.data, mediaType: 'image/png' }],
        };
      },
    }),
  },
  // ...
});
```

