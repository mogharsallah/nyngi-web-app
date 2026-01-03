## Speech Models

You can create models that call Fal text-to-speech endpoints using the `.speech()` factory method.

### Basic Usage

```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { fal } from '@ai-sdk/fal';

const result = await generateSpeech({
  model: fal.speech('fal-ai/minimax/speech-02-hd'),
  text: 'Hello from the AI SDK!',
});
```

### Model Capabilities

| Model                                     | Description                                                                                                                                                           |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fal-ai/minimax/voice-clone`              | Clone a voice from a sample audio and generate speech from text prompts                                                                                               |
| `fal-ai/minimax/voice-design`             | Design a personalized voice from a text description and generate speech from text prompts                                                                             |
| `fal-ai/dia-tts/voice-clone`              | Clone dialog voices from a sample audio and generate dialogs from text prompts                                                                                        |
| `fal-ai/minimax/speech-02-hd`             | Generate speech from text prompts and different voices                                                                                                                |
| `fal-ai/minimax/speech-02-turbo`          | Generate fast speech from text prompts and different voices                                                                                                           |
| `fal-ai/dia-tts`                          | Directly generates realistic dialogue from transcripts with audio conditioning for emotion control. Produces natural nonverbals like laughter and throat clearing     |
| `resemble-ai/chatterboxhd/text-to-speech` | Generate expressive, natural speech with Resemble AI's Chatterbox. Features unique emotion control, instant voice cloning from short audio, and built-in watermarking |

### Provider Options

Pass provider-specific options via `providerOptions.fal` depending on the model:

- **voice_setting** _object_

  - `voice_id` (string): predefined voice ID
  - `speed` (number): 0.5–2.0
  - `vol` (number): 0–10
  - `pitch` (number): -12–12
  - `emotion` (enum): happy | sad | angry | fearful | disgusted | surprised | neutral
  - `english_normalization` (boolean)

- **audio_setting** _object_
  Audio configuration settings specific to the model.

- **language_boost** _enum_
  Chinese | Chinese,Yue | English | Arabic | Russian | Spanish | French | Portuguese | German | Turkish | Dutch | Ukrainian | Vietnamese | Indonesian | Japanese | Italian | Korean | Thai | Polish | Romanian | Greek | Czech | Finnish | Hindi | auto

- **pronunciation_dict** _object_
  Custom pronunciation dictionary for specific words.

Model-specific parameters (e.g., `audio_url`, `prompt`, `preview_text`, `ref_audio_url`, `ref_text`) can be passed directly under `providerOptions.fal` and will be forwarded to the Fal API.

---
title: AssemblyAI
description: Learn how to use the AssemblyAI provider for the AI SDK.
---

