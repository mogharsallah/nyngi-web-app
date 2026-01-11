---
description: Update a skill from its original llms.txt source
argument-hint: <skill-name> [--all] [--force]
allowed-tools: Bash(python3:*)
---

# Update Skill from Tracked Source

Update an existing Claude Code skill by re-fetching its original llms.txt source.

## Arguments
- `<skill-name>`: Name of skill to update
- `--all`: Update all skills that have tracked sources
- `--force`: Update even if content hash hasn't changed
- `--dir DIR`: Skills directory (default: .claude/skills)

## Task
Execute the shardskill updater with the provided arguments:

```
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/shardskill.py" update $ARGUMENTS
```

After execution, report:
1. Which skills were checked
2. Whether changes were detected (hash comparison)
3. What was updated (if any)
4. Any errors encountered
