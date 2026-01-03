## Important considerations

- **Incompatibility with abort**: Stream resumption is not compatible with abort functionality. Closing a tab or refreshing the page triggers an abort signal that will break the resumption mechanism. Do not use `resume: true` if you need abort functionality in your application
- **Stream expiration**: Streams in Redis expire after a set time (configurable in the `resumable-stream` package)
- **Multiple clients**: Multiple clients can connect to the same stream simultaneously
- **Error handling**: When no active stream exists, the GET handler returns a 204 (No Content) status code
- **Security**: Ensure proper authentication and authorization for both creating and resuming streams
- **Race conditions**: Clear the `activeStreamId` when starting a new stream to prevent resuming outdated streams

<br />
<GithubLink link="https://github.com/vercel/ai/blob/main/examples/next" />

---
title: Chatbot Tool Usage
description: Learn how to use tools with the useChat hook.
---

