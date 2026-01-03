## Prerequisites

To implement resumable streams in your chat application, you need:

1. **The `resumable-stream` package** - Handles the publisher/subscriber mechanism for streams
2. **A Redis instance** - Stores stream data (e.g. [Redis through Vercel](https://vercel.com/marketplace/redis))
3. **A persistence layer** - Tracks which stream ID is active for each chat (e.g. database)

