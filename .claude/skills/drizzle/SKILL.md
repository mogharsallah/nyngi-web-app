---
name: drizzle
description: Drizzle ORM documentation and guides. Use when working with Drizzle queries, schemas, migrations, database operations, or when the user mentions Drizzle, database schemas, SQL with TypeScript, or ORM queries.
---

# Drizzle ORM Skill

This Skill provides access to comprehensive Drizzle ORM documentation organized by chapters for token-efficient retrieval.

## Retrieval Workflow

Follow this structured approach to find information:

1. **Start with the manifest**: Read [_manifest.md](_manifest.md) to find the broad category for your topic
2. **Find the specific topic**: Read the `_index.md` file inside the identified chapter's folder  
3. **Read the content**: Open the referenced markdown file for detailed documentation

## When to use search

If you're unsure which chapter contains the information you need:

```bash
grep -r "search_term" .claude/skills/drizzle/docs/
```

## Rules

- **Always start at** [_manifest.md](_manifest.md)
- **Do not guess file paths** - follow the manifest → index → content workflow
- **Load only what you need** - don't read entire chapters unless necessary

## Available Documentation

See [_manifest.md](_manifest.md) for the complete chapter list, descriptions, and organization.
