# shardskill

A Claude Code plugin to generate skills from [llms.txt](https://llmstxt.org/) documentation files.

## Features

- **Generate skills from llms.txt** - Convert llms.txt files into organized Claude Code skills
- **URL support** - Fetch llms.txt directly from HTTP/HTTPS URLs
- **Source tracking** - Track the original source for easy updates
- **Smart updates** - Detect changes via content hashing, only regenerate when needed
- **Config preservation** - User customizations (allowed-tools, description) survive updates
- **Description generation** - AI-powered skill descriptions optimized for Claude Code discovery
- **Token estimation** - Approximate token counts for each chapter and topic
- **Code block safety** - Never split content inside code fences
- **H3+ chunking** - Only split on H1 (chapters) and H2 (topics), keep sub-headers together

## Installation

### Local Testing

```bash
claude --plugin-dir ./shardskill
```

### Project Installation

Copy the `shardskill` folder to your project and load it:

```bash
claude --plugin-dir ./path/to/shardskill
```

## Commands

### `/shardskill:generate`

Generate a new Claude Code skill from an llms.txt file or URL.

```bash
# From URL (auto-detects name from first H1)
/shardskill:generate https://sdk.vercel.ai/llms.txt

# With custom name
/shardskill:generate https://sdk.vercel.ai/llms.txt --name vercel-ai-sdk

# From local file
/shardskill:generate ./docs/llms.txt --name my-library

# Force overwrite (preserves config)
/shardskill:generate https://sdk.vercel.ai/llms.txt --name ai-sdk --force
```

**Arguments:**
- `<url-or-path>` - HTTP URL or local file path to llms.txt
- `--name NAME` - Skill name (auto-derived from first H1 or filename if omitted)
- `--force` - Overwrite existing skill while preserving SKILL.md config
- `--dir DIR` - Output directory (default: `.claude/skills`)

### `/shardskill:update`

Update an existing skill from its tracked source.

```bash
# Update specific skill
/shardskill:update ai-sdk

# Update all tracked skills
/shardskill:update --all

# Force update even if unchanged
/shardskill:update ai-sdk --force
```

**Arguments:**
- `<skill-name>` - Name of skill to update
- `--all` - Update all skills that have tracked sources
- `--force` - Update even if content hash hasn't changed
- `--dir DIR` - Skills directory (default: `.claude/skills`)

### `/shardskill:list`

List all skills with their tracking information.

```bash
/shardskill:list
```

### `/shardskill:describe`

Generate an optimized description for a skill using Claude Code.

```bash
/shardskill:describe ai-sdk
```

This command analyzes the skill's content and generates a description optimized for Claude Code's skill discovery. The description is the **only** field Claude reads to determine when to use a skill, so this is important for discoverability.

**Arguments:**
- `<skill-name>` - Name of the skill to describe

**How it works:**
1. Reads the skill's `SKILL.md` to understand structure and content
2. Analyzes chapter titles and token distribution
3. Generates a description (max 1024 chars) following Claude Code best practices
4. Updates the skill's frontmatter with the new description

## Generated Skill Structure

```
.claude/skills/my-skill/
├── SKILL.md           # Skill metadata, chapter catalog, and retrieval instructions
├── .shardskill.json   # Source tracking for updates
└── docs/
    ├── chapter-name/
    │   ├── _index.md      # Chapter overview and topic list
    │   ├── overview.md    # H1 content
    │   ├── topic-one.md   # H2 content
    │   └── topic-two.md
    └── another-chapter/
        └── ...
```

## Source Tracking

Each generated skill includes a `.shardskill.json` file:

```json
{
  "source": "https://sdk.vercel.ai/llms.txt",
  "source_type": "url",
  "content_hash": "sha256:abc123...",
  "generated_at": "2025-01-11T12:00:00Z",
  "generator_version": "1.0.0",
  "skill_name": "ai-sdk",
  "stats": {
    "chapters": 12,
    "topics": 145,
    "total_tokens": 50000
  }
}
```

This enables:
- **Update detection** - Compare content hash to detect changes
- **Easy updates** - Run `/shardskill:update skill-name` to refresh
- **Audit trail** - Know where documentation came from

## How It Works

1. **Parsing** - Reads llms.txt and splits on H1 (chapters) and H2 (topics)
2. **Code block safety** - Tracks fence state to never split inside code blocks
3. **Normalization** - Cleans filenames, normalizes links
4. **Token estimation** - Approximates ~4 chars per token
5. **Index generation** - Creates `_index.md` files for chapter navigation
6. **Catalog embedding** - Chapter listing is embedded directly in `SKILL.md`

## Requirements

- Python 3.10+ (available as `python3` command)
- No external dependencies (uses stdlib only)

## License

MIT
