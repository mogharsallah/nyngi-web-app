## Speech Models

You can create models that call the [ElevenLabs speech API](https://elevenlabs.io/text-to-speech)
using the `.speech()` factory method.

The first argument is the model id e.g. `eleven_multilingual_v2`.

```ts
const model = elevenlabs.speech('eleven_multilingual_v2');
```

You can also pass additional provider-specific options using the `providerOptions` argument. For example, supplying a voice to use for the generated audio.

```ts highlight="6"
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { elevenlabs } from '@ai-sdk/elevenlabs';

const result = await generateSpeech({
  model: elevenlabs.speech('eleven_multilingual_v2'),
  text: 'Hello, world!',
  providerOptions: { elevenlabs: {} },
});
```

- **language_code** _string or null_  
  Optional. Language code (ISO 639-1) used to enforce a language for the model. Currently, only Turbo v2.5 and Flash v2.5 support language enforcement. For other models, providing a language code will result in an error.

- **voice_settings** _object or null_  
  Optional. Voice settings that override stored settings for the given voice. These are applied only to the current request.

  - **stability** _double or null_  
    Optional. Determines how stable the voice is and the randomness between each generation. Lower values introduce broader emotional range; higher values result in a more monotonous voice.
  - **use_speaker_boost** _boolean or null_  
    Optional. Boosts similarity to the original speaker. Increases computational load and latency.
  - **similarity_boost** _double or null_  
    Optional. Controls how closely the AI should adhere to the original voice.
  - **style** _double or null_  
    Optional. Amplifies the style of the original speaker. May increase latency if set above 0.

- **pronunciation_dictionary_locators** _array of objects or null_  
  Optional. A list of pronunciation dictionary locators to apply to the text, in order. Up to 3 locators per request.  
  Each locator object:

  - **pronunciation_dictionary_id** _string_ (required)  
    The ID of the pronunciation dictionary.
  - **version_id** _string or null_ (optional)  
    The version ID of the dictionary. If not provided, the latest version is used.

- **seed** _integer or null_  
  Optional. If specified, the system will attempt to sample deterministically. Must be between 0 and 4294967295. Determinism is not guaranteed.

- **previous_text** _string or null_  
  Optional. The text that came before the current request's text. Can improve continuity when concatenating generations or influence current generation continuity.

- **next_text** _string or null_  
  Optional. The text that comes after the current request's text. Can improve continuity when concatenating generations or influence current generation continuity.

- **previous_request_ids** _array of strings or null_  
  Optional. List of request IDs for samples generated before this one. Improves continuity when splitting large tasks. Max 3 IDs. If both `previous_text` and `previous_request_ids` are sent, `previous_text` is ignored.

- **next_request_ids** _array of strings or null_  
  Optional. List of request IDs for samples generated after this one. Useful for maintaining continuity when regenerating a sample. Max 3 IDs. If both `next_text` and `next_request_ids` are sent, `next_text` is ignored.

- **apply_text_normalization** _enum_  
  Optional. Controls text normalization.  
  Allowed values: `'auto'` (default), `'on'`, `'off'`.

  - `'auto'`: System decides whether to apply normalization (e.g., spelling out numbers).
  - `'on'`: Always apply normalization.
  - `'off'`: Never apply normalization.  
    For `eleven_turbo_v2_5` and `eleven_flash_v2_5`, can only be enabled with Enterprise plans.

- **apply_language_text_normalization** _boolean_  
  Optional. Defaults to `false`. Controls language text normalization, which helps with proper pronunciation in some supported languages (currently only Japanese). May significantly increase latency.

### Model Capabilities

| Model                    | Instructions        |
| ------------------------ | ------------------- |
| `eleven_v3`              | <Check size={18} /> |
| `eleven_multilingual_v2` | <Check size={18} /> |
| `eleven_flash_v2_5`      | <Check size={18} /> |
| `eleven_flash_v2`        | <Check size={18} /> |
| `eleven_turbo_v2_5`      | <Check size={18} /> |
| `eleven_turbo_v2`        | <Check size={18} /> |
| `eleven_monolingual_v1`  | <Check size={18} /> |
| `eleven_multilingual_v1` | <Check size={18} /> |

