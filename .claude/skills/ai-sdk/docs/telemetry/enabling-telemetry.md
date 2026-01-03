## Enabling telemetry

For Next.js applications, please follow the [Next.js OpenTelemetry guide](https://nextjs.org/docs/app/building-your-application/optimizing/open-telemetry) to enable telemetry first.

You can then use the `experimental_telemetry` option to enable telemetry on specific function calls while the feature is experimental:

```ts highlight="4"
const result = await generateText({
  model: __MODEL__,
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

When telemetry is enabled, you can also control if you want to record the input values and the output values for the function.
By default, both are enabled. You can disable them by setting the `recordInputs` and `recordOutputs` options to `false`.

Disabling the recording of inputs and outputs can be useful for privacy, data transfer, and performance reasons.
You might for example want to disable recording inputs if they contain sensitive information.

