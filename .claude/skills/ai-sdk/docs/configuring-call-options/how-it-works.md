## How It Works

Define call options in three steps:

1. **Define the schema** - Specify what inputs you accept using `callOptionsSchema`
2. **Configure with `prepareCall`** - Use those inputs to modify agent settings
3. **Pass options at runtime** - Provide the options when calling `generate()` or `stream()`

