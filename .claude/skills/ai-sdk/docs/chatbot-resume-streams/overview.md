# Chatbot Resume Streams

`useChat` supports resuming ongoing streams after page reloads. Use this feature to build applications with long-running generations.

<Note type="warning">
  Stream resumption is not compatible with abort functionality. Closing a tab or
  refreshing the page triggers an abort signal that will break the resumption
  mechanism. Do not use `resume: true` if you need abort functionality in your
  application. See
  [troubleshooting](/docs/troubleshooting/abort-breaks-resumable-streams) for
  more details.
</Note>

