---
description: List all skills with tracked llms.txt sources
argument-hint: [--dir DIR]
allowed-tools: Bash(python3:*)
---

# List Tracked Skills

Show all Claude Code skills that have tracked llms.txt sources and can be updated.

## Arguments
- `--dir DIR`: Skills directory (default: .claude/skills)

## Task
Execute the shardskill list command:

```
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/shardskill.py" list $ARGUMENTS
```

Display the results in a clear format showing:
1. Skill name
2. Source URL/path
3. Last generated timestamp
4. Content hash (abbreviated)
