## Provider Instance

To use Clarifai, you can create a custom provider instance with the `createOpenAICompatible` function from `@ai-sdk/openai-compatible`:

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const clarifai = createOpenAICompatible({
  name: 'clarifai',
  baseURL: 'https://api.clarifai.com/v2/ext/openai/v1',
  apiKey: process.env.CLARIFAI_PAT,
});
```

<Note>
  You can obtain an API key by creating a Personal Access Token (PAT) in your Clarifai [account settings](https://clarifai.com/settings/security). Make sure to set the `CLARIFAI_PAT` environment variable with your PAT.

New users can sign up for a free account on [Clarifai](https://clarifai.com/signup) to get started.

</Note>

