## Migrating to `@ai-sdk/amazon-bedrock` 2.x

The Amazon Bedrock provider was rewritten in version 2.x to remove the
dependency on the `@aws-sdk/client-bedrock-runtime` package.

The `bedrockOptions` provider setting previously available has been removed. If
you were using the `bedrockOptions` object, you should now use the `region`,
`accessKeyId`, `secretAccessKey`, and `sessionToken` settings directly instead.

Note that you may need to set all of these explicitly, e.g. even if you're not
using `sessionToken`, set it to `undefined`. If you're running in a serverless
environment, there may be default environment variables set by your containing
environment that the Amazon Bedrock provider will then pick up and could
conflict with the ones you're intending to use.

---
title: Groq
description: Learn how to use Groq.
---

