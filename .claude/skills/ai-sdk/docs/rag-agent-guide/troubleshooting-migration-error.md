## Troubleshooting Migration Error

If you experience an error with the migration, open your migration file (`lib/db/migrations/0000_yielding_bloodaxe.sql`), cut (copy and remove) the first line, and run it directly on your postgres instance. You should now be able to run the updated migration.

If you're using the Vercel setup above, you can run the command directly by either:

- Going to the Neon console and entering the command there, or
- Going back to the Vercel platform, navigating to the Quick Start section of your database, and finding the PSQL connection command (second tab). This will connect to your instance in the terminal where you can run the command directly.

[More info](https://github.com/vercel/ai-sdk-rag-starter/issues/1).

---
title: Multi-Modal Agent
description: Learn how to build a multi-modal agent that can process images and PDFs with the AI SDK.
tags: ['multi-modal', 'agent', 'images', 'pdf', 'vision', 'next']
---

