---
description: Generate an optimized skill description using Claude Code
argument-hint: <skill-name>
allowed-tools: Read, Glob, Grep, Bash(python3:*)
---

# Generate Skill Description

Generate an optimized description for a Claude Code skill by analyzing its content.

## Arguments

- `<skill-name>`: Name of the skill to describe

## Task

1. **Read the skill's SKILL.md** at `.claude/skills/<skill-name>/SKILL.md` to understand:
   - Current structure and chapter listing
   - Total topics and token counts
   - Source documentation URL

2. **Read the chapters list** to understand the main topics. Prioritize chapters with higher token counts as they contain more substantial content. DO NOT READ the full content of chapters—only the titles and token counts.

3. **Generate a description** following Claude Code best practices:
   - Maximum 1024 characters
   - The description is the **ONLY** field Claude reads to determine when to use the skill
   - Include all "when to use" information in the description
   - Be clear and comprehensive about what the skill covers

   **Format template:**
   ```
   {Skill Name} documentation covering {key topics}. Use when working with {specific use cases} or when the user mentions {trigger keywords}.
   ```

   **Example:**
   ```
   Drizzle ORM documentation covering queries, schemas, migrations, and database connections. Use when working with Drizzle queries, database operations, SQL with TypeScript, or when the user mentions Drizzle, database schemas, or ORM patterns.
   ```

4. **Apply the description** using:
   ```
   python3 "${CLAUDE_PLUGIN_ROOT}/scripts/set_description.py" "<skill-name>" "<description>"
   ```

## Claude Code Skill Description Guidelines

From the official Claude Code documentation:

- **name and description are the ONLY fields Claude reads** to determine when the skill gets used
- Include all "when to use" information in the description, NOT in the body
- The body is only loaded after triggering, so "When to Use This Skill" sections in the body are not helpful
- Recommended limit: **1024 characters** for description
- Be clear and comprehensive about what the skill does and when to use it
