## How stream resumption works

Stream resumption requires persistence for messages and active streams in your application. The AI SDK provides tools to connect to storage, but you need to set up the storage yourself.

**The AI SDK provides:**

- A `resume` option in `useChat` that automatically reconnects to active streams
- Access to the outgoing stream through the `consumeSseStream` callback
- Automatic HTTP requests to your resume endpoints

**You build:**

- Storage to track which stream belongs to each chat
- Redis to store the UIMessage stream
- Two API endpoints: POST to create streams, GET to resume them
- Integration with [`resumable-stream`](https://www.npmjs.com/package/resumable-stream) to manage Redis storage

