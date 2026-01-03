## Slack App Setup

Before we start building, you'll need to create and configure a Slack app:

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" and choose "From scratch"
3. Give your app a name and select your workspace
4. Under "OAuth & Permissions", add the following bot token scopes:
   - `app_mentions:read`
   - `chat:write`
   - `im:history`
   - `im:write`
   - `assistant:write`
5. Install the app to your workspace (button under "OAuth Tokens" subsection)
6. Copy the Bot User OAuth Token and Signing Secret for the next step
7. Under App Home -> Show Tabs -> Chat Tab, check "Allow users to send Slash commands and messages from the chat tab"

