---
description: Generate a Claude Code skill from an llms.txt file or URL
argument-hint: <url-or-path> [--name NAME] [--force]
allowed-tools: Bash(python3:*)
---

# Generate Skill from llms.txt

Generate a Claude Code skill from an llms.txt documentation file.

## Arguments
- `<url-or-path>`: HTTP URL or local file path to llms.txt
- `--name NAME`: Skill name (auto-derived from first H1 or filename if omitted)
- `--force`: Overwrite existing skill while preserving SKILL.md config
- `--dir DIR`: Output directory (default: .claude/skills)

## Task
Execute the shardskill generator with the provided arguments:

```
python3 "${CLAUDE_PLUGIN_ROOT}/scripts/shardskill.py" generate $ARGUMENTS
```

After execution, report:
1. The generated skill location
2. Number of chapters and topics created
3. Approximate token count
4. The source URL/path for future updates
