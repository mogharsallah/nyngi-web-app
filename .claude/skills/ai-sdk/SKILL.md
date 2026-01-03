---
name: ai-sdk
description: Use the Vercel AI SDK (ai package) for building AI features. Use when implementing streaming chat, AI agents, tool calling, structured output, or any AI/LLM functionality. Triggers on mentions of AI SDK, useChat, streamText, generateText, or AI streaming.
allowed-tools: WebFetch, Read, Write, Edit, Glob, Grep, Bash
---

# ai-sdk Instructions

You have access to a massive documentation set for ai-sdk.
The content is organized into **Chapters** to be token-efficient.

**Retrieval Workflow:**
1.  **Find the Chapter**: Read `_manifest.md` (in the root) to find the broad category.
2.  **Find the Topic**: Read the `_index.md` file *inside* that chapter's folder.
3.  **Read the Content**: Read the specific markdown file to answer.

## Rules
- **Start at `_manifest.md`**.
- Do not guess file paths.
- If unsure, use `grep -r "search_term" docs/` to find keywords.
