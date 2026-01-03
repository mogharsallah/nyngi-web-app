## Custom Tracer

You may provide a `tracer` which must return an OpenTelemetry `Tracer`. This is useful in situations where
you want your traces to use a `TracerProvider` other than the one provided by the `@opentelemetry/api` singleton.

```ts highlight="7"
const tracerProvider = new NodeTracerProvider();
const result = await generateText({
  model: __MODEL__,
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    tracer: tracerProvider.getTracer('ai'),
  },
});
```

