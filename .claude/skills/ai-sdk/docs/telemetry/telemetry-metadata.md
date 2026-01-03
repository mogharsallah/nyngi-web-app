## Telemetry Metadata

You can provide a `functionId` to identify the function that the telemetry data is for,
and `metadata` to include additional information in the telemetry data.

```ts highlight="6-10"
const result = await generateText({
  model: __MODEL__,
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'my-awesome-function',
    metadata: {
      something: 'custom',
      someOtherThing: 'other-value',
    },
  },
});
```

