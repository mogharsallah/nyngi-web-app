## Project Structure

The starter repository already includes:

- Slack utilities (`lib/slack-utils.ts`) including functions for validating incoming requests, converting Slack threads to AI SDK compatible message formats, and getting the Slackbot's user ID
- General utility functions (`lib/utils.ts`) including initial Exa setup
- Files to handle the different types of Slack events (`lib/handle-messages.ts` and `lib/handle-app-mention.ts`)
- An API endpoint (`POST`) for Slack events (`api/events.ts`)

