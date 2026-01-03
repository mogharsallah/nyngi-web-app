## How it works

The DevTools middleware intercepts all `generateText` and `streamText` calls through the [language model middleware](/docs/ai-sdk-core/middleware) system. Captured data is stored locally in a JSON file (`.devtools/generations.json`) and served through a web UI built with Hono and React.

<Note type="warning">
  The middleware automatically adds `.devtools` to your `.gitignore` file.
  Verify that `.devtools` is in your `.gitignore` to ensure you don't commit
  sensitive AI interaction data to your repository.
</Note>

