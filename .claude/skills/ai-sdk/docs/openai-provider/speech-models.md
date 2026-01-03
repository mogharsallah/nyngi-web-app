## Speech Models

You can create models that call the [OpenAI speech API](https://platform.openai.com/docs/api-reference/audio/speech)
using the `.speech()` factory method.

The first argument is the model id e.g. `tts-1`.

```ts
const model = openai.speech('tts-1');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying a voice to use for the generated audio.

```ts highlight="6"
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello, world!',
  providerOptions: { openai: {} },
});
```

- **instructions** _string_
  Control the voice of your generated audio with additional instructions e.g. "Speak in a slow and steady tone".
  Does not work with `tts-1` or `tts-1-hd`.
  Optional.

- **response_format** _string_
  The format to audio in.
  Supported formats are `mp3`, `opus`, `aac`, `flac`, `wav`, and `pcm`.
  Defaults to `mp3`.
  Optional.

- **speed** _number_
  The speed of the generated audio.
  Select a value from 0.25 to 4.0.
  Defaults to 1.0.
  Optional.

### Model Capabilities

| Model             | Instructions        |
| ----------------- | ------------------- |
| `tts-1`           | <Check size={18} /> |
| `tts-1-hd`        | <Check size={18} /> |
| `gpt-4o-mini-tts` | <Check size={18} /> |

---
title: Azure OpenAI
description: Learn how to use the Azure OpenAI provider for the AI SDK.
---

