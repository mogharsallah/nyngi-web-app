## Collected Data

### generateText function

`generateText` records 3 types of spans:

- `ai.generateText` (span): the full length of the generateText call. It contains 1 or more `ai.generateText.doGenerate` spans.
  It contains the [basic LLM span information](#basic-llm-span-information) and the following attributes:

  - `operation.name`: `ai.generateText` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.generateText"`
  - `ai.prompt`: the prompt that was used when calling `generateText`
  - `ai.response.text`: the text that was generated
  - `ai.response.toolCalls`: the tool calls that were made as part of the generation (stringified JSON)
  - `ai.response.finishReason`: the reason why the generation finished
  - `ai.settings.maxOutputTokens`: the maximum number of output tokens that were set

- `ai.generateText.doGenerate` (span): a provider doGenerate call. It can contain `ai.toolCall` spans.
  It contains the [call LLM span information](#call-llm-span-information) and the following attributes:

  - `operation.name`: `ai.generateText.doGenerate` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.generateText.doGenerate"`
  - `ai.prompt.messages`: the messages that were passed into the provider
  - `ai.prompt.tools`: array of stringified tool definitions. The tools can be of type `function` or `provider-defined-client`.
    Function tools have a `name`, `description` (optional), and `inputSchema` (JSON schema).
    Provider-defined-client tools have a `name`, `id`, and `input` (Record).
  - `ai.prompt.toolChoice`: the stringified tool choice setting (JSON). It has a `type` property
    (`auto`, `none`, `required`, `tool`), and if the type is `tool`, a `toolName` property with the specific tool.
  - `ai.response.text`: the text that was generated
  - `ai.response.toolCalls`: the tool calls that were made as part of the generation (stringified JSON)
  - `ai.response.finishReason`: the reason why the generation finished

- `ai.toolCall` (span): a tool call that is made as part of the generateText call. See [Tool call spans](#tool-call-spans) for more details.

### streamText function

`streamText` records 3 types of spans and 2 types of events:

- `ai.streamText` (span): the full length of the streamText call. It contains a `ai.streamText.doStream` span.
  It contains the [basic LLM span information](#basic-llm-span-information) and the following attributes:

  - `operation.name`: `ai.streamText` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.streamText"`
  - `ai.prompt`: the prompt that was used when calling `streamText`
  - `ai.response.text`: the text that was generated
  - `ai.response.toolCalls`: the tool calls that were made as part of the generation (stringified JSON)
  - `ai.response.finishReason`: the reason why the generation finished
  - `ai.settings.maxOutputTokens`: the maximum number of output tokens that were set

- `ai.streamText.doStream` (span): a provider doStream call.
  This span contains an `ai.stream.firstChunk` event and `ai.toolCall` spans.
  It contains the [call LLM span information](#call-llm-span-information) and the following attributes:

  - `operation.name`: `ai.streamText.doStream` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.streamText.doStream"`
  - `ai.prompt.messages`: the messages that were passed into the provider
  - `ai.prompt.tools`: array of stringified tool definitions. The tools can be of type `function` or `provider-defined-client`.
    Function tools have a `name`, `description` (optional), and `inputSchema` (JSON schema).
    Provider-defined-client tools have a `name`, `id`, and `input` (Record).
  - `ai.prompt.toolChoice`: the stringified tool choice setting (JSON). It has a `type` property
    (`auto`, `none`, `required`, `tool`), and if the type is `tool`, a `toolName` property with the specific tool.
  - `ai.response.text`: the text that was generated
  - `ai.response.toolCalls`: the tool calls that were made as part of the generation (stringified JSON)
  - `ai.response.msToFirstChunk`: the time it took to receive the first chunk in milliseconds
  - `ai.response.msToFinish`: the time it took to receive the finish part of the LLM stream in milliseconds
  - `ai.response.avgCompletionTokensPerSecond`: the average number of completion tokens per second
  - `ai.response.finishReason`: the reason why the generation finished

- `ai.toolCall` (span): a tool call that is made as part of the generateText call. See [Tool call spans](#tool-call-spans) for more details.

- `ai.stream.firstChunk` (event): an event that is emitted when the first chunk of the stream is received.

  - `ai.response.msToFirstChunk`: the time it took to receive the first chunk

- `ai.stream.finish` (event): an event that is emitted when the finish part of the LLM stream is received.

It also records a `ai.stream.firstChunk` event when the first chunk of the stream is received.

### generateObject function

`generateObject` records 2 types of spans:

- `ai.generateObject` (span): the full length of the generateObject call. It contains 1 or more `ai.generateObject.doGenerate` spans.
  It contains the [basic LLM span information](#basic-llm-span-information) and the following attributes:

  - `operation.name`: `ai.generateObject` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.generateObject"`
  - `ai.prompt`: the prompt that was used when calling `generateObject`
  - `ai.schema`: Stringified JSON schema version of the schema that was passed into the `generateObject` function
  - `ai.schema.name`: the name of the schema that was passed into the `generateObject` function
  - `ai.schema.description`: the description of the schema that was passed into the `generateObject` function
  - `ai.response.object`: the object that was generated (stringified JSON)
  - `ai.settings.output`: the output type that was used, e.g. `object` or `no-schema`

- `ai.generateObject.doGenerate` (span): a provider doGenerate call.
  It contains the [call LLM span information](#call-llm-span-information) and the following attributes:

  - `operation.name`: `ai.generateObject.doGenerate` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.generateObject.doGenerate"`
  - `ai.prompt.messages`: the messages that were passed into the provider
  - `ai.response.object`: the object that was generated (stringified JSON)
  - `ai.response.finishReason`: the reason why the generation finished

### streamObject function

`streamObject` records 2 types of spans and 1 type of event:

- `ai.streamObject` (span): the full length of the streamObject call. It contains 1 or more `ai.streamObject.doStream` spans.
  It contains the [basic LLM span information](#basic-llm-span-information) and the following attributes:

  - `operation.name`: `ai.streamObject` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.streamObject"`
  - `ai.prompt`: the prompt that was used when calling `streamObject`
  - `ai.schema`: Stringified JSON schema version of the schema that was passed into the `streamObject` function
  - `ai.schema.name`: the name of the schema that was passed into the `streamObject` function
  - `ai.schema.description`: the description of the schema that was passed into the `streamObject` function
  - `ai.response.object`: the object that was generated (stringified JSON)
  - `ai.settings.output`: the output type that was used, e.g. `object` or `no-schema`

- `ai.streamObject.doStream` (span): a provider doStream call.
  This span contains an `ai.stream.firstChunk` event.
  It contains the [call LLM span information](#call-llm-span-information) and the following attributes:

  - `operation.name`: `ai.streamObject.doStream` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.streamObject.doStream"`
  - `ai.prompt.messages`: the messages that were passed into the provider
  - `ai.response.object`: the object that was generated (stringified JSON)
  - `ai.response.msToFirstChunk`: the time it took to receive the first chunk
  - `ai.response.finishReason`: the reason why the generation finished

- `ai.stream.firstChunk` (event): an event that is emitted when the first chunk of the stream is received.
  - `ai.response.msToFirstChunk`: the time it took to receive the first chunk

### embed function

`embed` records 2 types of spans:

- `ai.embed` (span): the full length of the embed call. It contains 1 `ai.embed.doEmbed` spans.
  It contains the [basic embedding span information](#basic-embedding-span-information) and the following attributes:

  - `operation.name`: `ai.embed` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.embed"`
  - `ai.value`: the value that was passed into the `embed` function
  - `ai.embedding`: a JSON-stringified embedding

- `ai.embed.doEmbed` (span): a provider doEmbed call.
  It contains the [basic embedding span information](#basic-embedding-span-information) and the following attributes:

  - `operation.name`: `ai.embed.doEmbed` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.embed.doEmbed"`
  - `ai.values`: the values that were passed into the provider (array)
  - `ai.embeddings`: an array of JSON-stringified embeddings

### embedMany function

`embedMany` records 2 types of spans:

- `ai.embedMany` (span): the full length of the embedMany call. It contains 1 or more `ai.embedMany.doEmbed` spans.
  It contains the [basic embedding span information](#basic-embedding-span-information) and the following attributes:

  - `operation.name`: `ai.embedMany` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.embedMany"`
  - `ai.values`: the values that were passed into the `embedMany` function
  - `ai.embeddings`: an array of JSON-stringified embedding

- `ai.embedMany.doEmbed` (span): a provider doEmbed call.
  It contains the [basic embedding span information](#basic-embedding-span-information) and the following attributes:

  - `operation.name`: `ai.embedMany.doEmbed` and the functionId that was set through `telemetry.functionId`
  - `ai.operationId`: `"ai.embedMany.doEmbed"`
  - `ai.values`: the values that were sent to the provider
  - `ai.embeddings`: an array of JSON-stringified embeddings for each value

