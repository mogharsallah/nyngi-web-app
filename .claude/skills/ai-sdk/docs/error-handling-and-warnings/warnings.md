## Warnings

The AI SDK shows warnings when something might not work as expected.
These warnings help you fix problems before they cause errors.

### When Warnings Appear

Warnings are shown in the browser console when:

- **Unsupported features**: You use a feature or setting that is not supported by the AI model (e.g., certain options or parameters).
- **Compatibility warnings**: A feature is used in a compatibility mode, which might work differently or less optimally than intended.
- **Other warnings**: The AI model reports another type of issue, such as general problems or advisory messages.

### Warning Messages

All warnings start with "AI SDK Warning:" so you can easily find them. For example:

```
AI SDK Warning: The feature "temperature" is not supported by this model
```

### Turning Off Warnings

By default, warnings are shown in the console. You can control this behavior:

#### Turn Off All Warnings

Set a global variable to turn off warnings completely:

```ts
globalThis.AI_SDK_LOG_WARNINGS = false;
```

#### Custom Warning Handler

You can also provide your own function to handle warnings.
It receives provider id, model id, and a list of warnings.

```ts
globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => {
  // Handle warnings your own way
};
```

