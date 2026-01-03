## Transcription Models

You can create models that call the [Deepgram transcription API](https://developers.deepgram.com/docs/pre-recorded-audio)
using the `.transcription()` factory method.

The first argument is the model id e.g. `nova-3`.

```ts
const model = deepgram.transcription('nova-3');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the `summarize` option will enable summaries for sections of content.

```ts highlight="6"
import { experimental_transcribe as transcribe } from 'ai';
import { deepgram } from '@ai-sdk/deepgram';
import { readFile } from 'fs/promises';

const result = await transcribe({
  model: deepgram.transcription('nova-3'),
  audio: await readFile('audio.mp3'),
  providerOptions: { deepgram: { summarize: true } },
});
```

The following provider options are available:

- **language** _string_

  Language code for the audio.
  Supports numerous ISO-639-1 and ISO-639-3 language codes.
  Optional.

- **smartFormat** _boolean_

  Whether to apply smart formatting to the transcription.
  Optional.

- **punctuate** _boolean_

  Whether to add punctuation to the transcription.
  Optional.

- **paragraphs** _boolean_

  Whether to format the transcription into paragraphs.
  Optional.

- **summarize** _enum | boolean_

  Whether to generate a summary of the transcription.
  Allowed values: `'v2'`, `false`.
  Optional.

- **topics** _boolean_

  Whether to detect topics in the transcription.
  Optional.

- **intents** _boolean_

  Whether to detect intents in the transcription.
  Optional.

- **sentiment** _boolean_

  Whether to perform sentiment analysis on the transcription.
  Optional.

- **detectEntities** _boolean_

  Whether to detect entities in the transcription.
  Optional.

- **redact** _string | array of strings_

  Specifies what content to redact from the transcription.
  Optional.

- **replace** _string_

  Replacement string for redacted content.
  Optional.

- **search** _string_

  Search term to find in the transcription.
  Optional.

- **keyterm** _string_

  Key terms to identify in the transcription.
  Optional.

- **diarize** _boolean_

  Whether to identify different speakers in the transcription.
  Defaults to `true`.
  Optional.

- **utterances** _boolean_

  Whether to segment the transcription into utterances.
  Optional.

- **uttSplit** _number_

  Threshold for splitting utterances.
  Optional.

- **fillerWords** _boolean_

  Whether to include filler words (um, uh, etc.) in the transcription.
  Optional.

### Model Capabilities

| Model                                                                                              | Transcription       | Duration            | Segments            | Language            |
| -------------------------------------------------------------------------------------------------- | ------------------- | ------------------- | ------------------- | ------------------- |
| `nova-3` (+ [variants](https://developers.deepgram.com/docs/models-languages-overview#nova-3))     | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Cross size={18} /> |
| `nova-2` (+ [variants](https://developers.deepgram.com/docs/models-languages-overview#nova-2))     | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Cross size={18} /> |
| `nova` (+ [variants](https://developers.deepgram.com/docs/models-languages-overview#nova))         | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Cross size={18} /> |
| `enhanced` (+ [variants](https://developers.deepgram.com/docs/models-languages-overview#enhanced)) | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Cross size={18} /> |
| `base` (+ [variants](https://developers.deepgram.com/docs/models-languages-overview#base))         | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Cross size={18} /> |

---
title: Black Forest Labs
description: Learn how to use Black Forest Labs models with the AI SDK.
---

