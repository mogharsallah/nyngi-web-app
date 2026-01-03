## Speech Models

You can create models that call the [LMNT speech API](https://docs.lmnt.com/api-reference/speech/synthesize-speech-bytes)
using the `.speech()` factory method.

The first argument is the model id e.g. `aurora`.

```ts
const model = lmnt.speech('aurora');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying a voice to use for the generated audio.

```ts highlight="6"
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { lmnt } from '@ai-sdk/lmnt';

const result = await generateSpeech({
  model: lmnt.speech('aurora'),
  text: 'Hello, world!',
  language: 'en', // Standardized language parameter
});
```

### Provider Options

The LMNT provider accepts the following options:

- **model** _'aurora' | 'blizzard'_

  The LMNT model to use. Defaults to `'aurora'`.

- **language** _'auto' | 'en' | 'es' | 'pt' | 'fr' | 'de' | 'zh' | 'ko' | 'hi' | 'ja' | 'ru' | 'it' | 'tr'_

  The language to use for speech synthesis. Defaults to `'auto'`.

- **format** _'aac' | 'mp3' | 'mulaw' | 'raw' | 'wav'_

  The audio format to return. Defaults to `'mp3'`.

- **sampleRate** _number_

  The sample rate of the audio in Hz. Defaults to `24000`.

- **speed** _number_

  The speed of the speech. Must be between 0.25 and 2. Defaults to `1`.

- **seed** _number_

  An optional seed for deterministic generation.

- **conversational** _boolean_

  Whether to use a conversational style. Defaults to `false`.

- **length** _number_

  Maximum length of the audio in seconds. Maximum value is 300.

- **topP** _number_

  Top-p sampling parameter. Must be between 0 and 1. Defaults to `1`.

- **temperature** _number_

  Temperature parameter for sampling. Must be at least 0. Defaults to `1`.

### Model Capabilities

| Model      | Instructions        |
| ---------- | ------------------- |
| `aurora`   | <Check size={18} /> |
| `blizzard` | <Check size={18} /> |

---
title: Google Generative AI
description: Learn how to use Google Generative AI Provider.
---

