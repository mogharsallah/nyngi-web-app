## Transcription Models

You can create models that call the [Fal transcription API](https://docs.fal.ai/guides/convert-speech-to-text)
using the `.transcription()` factory method.

The first argument is the model id without the `fal-ai/` prefix e.g. `wizper`.

```ts
const model = fal.transcription('wizper');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying the `batchSize` option will increase the number of audio chunks processed in parallel.

```ts highlight="6"
import { experimental_transcribe as transcribe } from 'ai';
import { fal } from '@ai-sdk/fal';
import { readFile } from 'fs/promises';

const result = await transcribe({
  model: fal.transcription('wizper'),
  audio: await readFile('audio.mp3'),
  providerOptions: { fal: { batchSize: 10 } },
});
```

The following provider options are available:

- **language** _string_
  Language of the audio file. If set to null, the language will be automatically detected.
  Accepts ISO language codes like 'en', 'fr', 'zh', etc.
  Optional.

- **diarize** _boolean_
  Whether to diarize the audio file (identify different speakers).
  Defaults to true.
  Optional.

- **chunkLevel** _string_
  Level of the chunks to return. Either 'segment' or 'word'.
  Default value: "segment"
  Optional.

- **version** _string_
  Version of the model to use. All models are Whisper large variants.
  Default value: "3"
  Optional.

- **batchSize** _number_
  Batch size for processing.
  Default value: 64
  Optional.

- **numSpeakers** _number_
  Number of speakers in the audio file. If not provided, the number of speakers will be automatically detected.
  Optional.

### Model Capabilities

| Model     | Transcription       | Duration            | Segments            | Language            |
| --------- | ------------------- | ------------------- | ------------------- | ------------------- |
| `whisper` | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |
| `wizper`  | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> | <Check size={18} /> |

