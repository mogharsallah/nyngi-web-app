#!/usr/bin/env python3
"""
shardskill - Generate Claude Code skills from llms.txt documentation files.

Usage:
    shardskill generate <input> [--name NAME] [--force] [--dir DIR]
    shardskill update <skill-name> [--all] [--force] [--dir DIR]
    shardskill list [--dir DIR]
"""

import os
import re
import sys
import json
import shutil
import hashlib
import argparse
from datetime import datetime, timezone
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

VERSION = "1.0.0"
DEFAULT_SKILLS_DIR = os.path.join(".", ".claude", "skills")


def clean_filename(name: str) -> str:
    """Sanitize string to be safe for filenames and folder names."""
    clean = re.sub(r'\s+', '-', name.lower())
    clean = re.sub(r'[^a-z0-9-]', '', clean)
    return clean[:60]


def estimate_tokens(text: str) -> int:
    """Rough token estimate: ~4 characters per token."""
    return len(text) // 4


def compute_hash(content: str) -> str:
    """Compute SHA256 hash of content."""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()


def is_url(source: str) -> bool:
    """Check if source is an HTTP/HTTPS URL."""
    return source.startswith('http://') or source.startswith('https://')


def fetch_url(url: str) -> str:
    """Fetch content from URL."""
    print(f"📡 Fetching {url}...")
    req = Request(url, headers={'User-Agent': 'shardskill/1.0'})
    try:
        with urlopen(req, timeout=30) as response:
            return response.read().decode('utf-8')
    except HTTPError as e:
        print(f"❌ HTTP Error {e.code}: {e.reason}")
        sys.exit(1)
    except URLError as e:
        print(f"❌ URL Error: {e.reason}")
        sys.exit(1)


def read_file(path: str) -> str:
    """Read content from local file."""
    print(f"📄 Reading {path}...")
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"❌ File not found: {path}")
        sys.exit(1)
    except IOError as e:
        print(f"❌ Error reading file: {e}")
        sys.exit(1)


def get_content(source: str) -> tuple[str, str]:
    """Get content from URL or file. Returns (content, source_type)."""
    if is_url(source):
        return fetch_url(source), "url"
    else:
        return read_file(source), "file"


def extract_first_h1(content: str) -> str | None:
    """Extract first H1 header from content."""
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None


def derive_name_from_source(source: str) -> str:
    """Derive skill name from source URL or filename."""
    if is_url(source):
        # Extract filename from URL path
        path = source.split('?')[0].split('#')[0]
        filename = os.path.basename(path)
        name = os.path.splitext(filename)[0]
    else:
        name = os.path.splitext(os.path.basename(source))[0]

    # Clean common suffixes
    name = re.sub(r'[-_]?llms[-_]?', '', name, flags=re.IGNORECASE)
    name = re.sub(r'[-_]?txt$', '', name, flags=re.IGNORECASE)

    return clean_filename(name) or "skill"


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from markdown content."""
    if not content.startswith('---'):
        return {}, content

    end = content.find('---', 3)
    if end == -1:
        return {}, content

    frontmatter_str = content[3:end].strip()
    body = content[end + 3:].strip()

    # Simple YAML parsing (key: value)
    frontmatter = {}
    for line in frontmatter_str.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()

    return frontmatter, body


def preserve_skill_config(skill_dir: str) -> dict:
    """Read existing SKILL.md and extract config to preserve."""
    skill_md_path = os.path.join(skill_dir, "SKILL.md")
    if not os.path.exists(skill_md_path):
        return {}

    try:
        with open(skill_md_path, 'r', encoding='utf-8') as f:
            content = f.read()
        frontmatter, _ = parse_frontmatter(content)
        # Preserve user-customized fields
        preserved = {}
        for key in ['allowed-tools', 'description']:
            if key in frontmatter:
                preserved[key] = frontmatter[key]
        return preserved
    except Exception:
        return {}


def generate_skill_md(
    skill_name: str,
    description: str,
    source: str,
    chapters: list,
    total_tokens: int,
    preserved_config: dict = None
) -> str:
    """Generate SKILL.md content with chapter catalog and retrieval instructions."""
    config = {
        'name': skill_name,
        'description': description,
        'allowed-tools': 'Read, Glob, Grep'
    }

    # Apply preserved config (user customizations survive updates)
    if preserved_config:
        config.update(preserved_config)

    frontmatter = '\n'.join(f"{k}: {v}" for k, v in config.items())

    # Generate metadata
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    total_topics = sum(c['topic_count'] for c in chapters)

    # Build chapter listing
    chapter_lines = []
    for chapter in chapters:
        tokens_str = f"~{chapter['tokens']:,}" if chapter.get('tokens') else ""
        chapter_lines.append(
            f"- [{chapter['title']}](docs/{chapter['folder']}/_index.md) - "
            f"{chapter['topic_count']} topics ({tokens_str} tokens)"
        )
    chapter_listing = '\n'.join(chapter_lines)

    return f"""---
{frontmatter}
---

# {skill_name} Documentation

**Source**: `{source}`
**Generated**: {timestamp}
**Total**: {total_topics} topics across {len(chapters)} chapters (~{total_tokens:,} tokens)

## Retrieval Workflow

1. **Find Chapter**: Browse the chapter listing below to locate the relevant category
2. **Find Topic**: Read `_index.md` inside that chapter's folder for the topic list
3. **Read Content**: Read the specific topic file

## Quick Search

If unsure which chapter contains your answer:
```
grep -r "keyword" .claude/skills/{skill_name}/docs/
```

## Chapters

{chapter_listing}

## Rules

- Start at this file to locate content - never guess file paths
- Read only necessary files to minimize token usage
- Cite specific file paths when referencing documentation
"""


def generate_chapter_index(chapter_title: str, topics: list, overview_content: str) -> str:
    """Generate _index.md for a chapter."""
    total_tokens = sum(t.get('tokens', 0) for t in topics)

    # Extract first paragraph from overview for summary
    first_para = ""
    if overview_content:
        paras = overview_content.strip().split('\n\n')
        for para in paras:
            if para.strip() and not para.strip().startswith('#'):
                first_para = para.strip()[:200]
                if len(para.strip()) > 200:
                    first_para += "..."
                break

    lines = [
        f"# {chapter_title}",
        "",
    ]

    if first_para:
        lines.extend([first_para, ""])

    lines.extend([
        f"## Topics ({len(topics)} files, ~{total_tokens:,} tokens)",
        ""
    ])

    for topic in topics:
        summary = topic.get('summary', '')[:80]
        if summary:
            lines.append(f"- [{topic['title']}]({topic['filename']}) - {summary}")
        else:
            lines.append(f"- [{topic['title']}]({topic['filename']})")

    return '\n'.join(lines)


def extract_first_line_summary(content: str) -> str:
    """Extract first non-header line as summary."""
    for line in content.split('\n'):
        line = line.strip()
        if line and not line.startswith('#') and not line.startswith('```'):
            # Clean up and truncate
            summary = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', line)  # Remove links
            return summary[:100]
    return ""


def normalize_links(content: str, current_folder: str) -> str:
    """Normalize relative links to work within skill structure."""
    def replace_link(match):
        text = match.group(1)
        url = match.group(2)

        # Keep external URLs and anchors unchanged
        if url.startswith('http') or url.startswith('#') or url.startswith('mailto:'):
            return match.group(0)

        # Normalize relative paths (simplified - keeps structure readable)
        return f"[{text}]({url})"

    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', replace_link, content)


class SkillGenerator:
    """Generate Claude Code skill from llms.txt content."""

    def __init__(self, skill_name: str, output_dir: str):
        self.skill_name = skill_name
        self.base_dir = os.path.join(output_dir, skill_name)
        self.docs_dir = os.path.join(self.base_dir, "docs")

        # State tracking
        self.chapters = []
        self.current_chapter = None
        self.current_chapter_dir = None
        self.current_topics = []
        self.current_file_path = None
        self.current_content = []
        self.in_code_block = False
        self.total_tokens = 0

    def _flush_file(self) -> dict | None:
        """Write current file to disk and return topic info."""
        if not self.current_file_path or not self.current_content:
            return None

        content = ''.join(self.current_content)
        content = normalize_links(content, os.path.dirname(self.current_file_path))

        with open(self.current_file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        tokens = estimate_tokens(content)
        self.total_tokens += tokens

        filename = os.path.basename(self.current_file_path)
        title = self.current_topic_title if hasattr(self, 'current_topic_title') else filename

        self.current_content = []

        return {
            'filename': filename,
            'title': title,
            'tokens': tokens,
            'summary': extract_first_line_summary(content)
        }

    def _flush_chapter(self):
        """Finalize current chapter with index file."""
        if not self.current_chapter_dir:
            return

        # Flush any pending file
        topic_info = self._flush_file()
        if topic_info:
            self.current_topics.append(topic_info)

        if not self.current_topics:
            return

        # Find overview content for summary
        overview_content = ""
        overview_path = os.path.join(self.current_chapter_dir, "overview.md")
        if os.path.exists(overview_path):
            with open(overview_path, 'r', encoding='utf-8') as f:
                overview_content = f.read()

        # Write chapter index
        index_content = generate_chapter_index(
            self.current_chapter['title'],
            self.current_topics,
            overview_content
        )
        index_path = os.path.join(self.current_chapter_dir, "_index.md")
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write(index_content)

        # Update chapter info
        chapter_tokens = sum(t['tokens'] for t in self.current_topics)
        self.current_chapter['tokens'] = chapter_tokens
        self.current_chapter['topic_count'] = len(self.current_topics)
        self.chapters.append(self.current_chapter)

        self.current_topics = []

    def _start_chapter(self, title: str):
        """Start a new chapter."""
        self._flush_chapter()

        folder_name = clean_filename(title)
        self.current_chapter_dir = os.path.join(self.docs_dir, folder_name)
        os.makedirs(self.current_chapter_dir, exist_ok=True)

        self.current_chapter = {
            'title': title,
            'folder': folder_name,
            'tokens': 0,
            'topic_count': 0
        }

        # Start overview file for chapter
        self.current_file_path = os.path.join(self.current_chapter_dir, "overview.md")
        self.current_topic_title = "Overview"
        self.current_content = []

    def _start_topic(self, title: str):
        """Start a new topic file (H2)."""
        # Only flush if not inside code block
        if not self.in_code_block:
            topic_info = self._flush_file()
            if topic_info:
                self.current_topics.append(topic_info)

        filename = clean_filename(title) + ".md"
        self.current_file_path = os.path.join(self.current_chapter_dir, filename)
        self.current_topic_title = title
        self.current_content = []

    def generate(self, content: str, source: str, preserved_config: dict = None):
        """Generate the skill from content."""
        os.makedirs(self.docs_dir, exist_ok=True)

        # Initialize with "General" chapter for preamble content
        self._start_chapter("General")

        lines = content.split('\n')
        for i, line in enumerate(lines):
            # Track code block state
            if line.strip().startswith('```'):
                self.in_code_block = not self.in_code_block

            # Only detect headers outside code blocks
            if not self.in_code_block:
                match_h1 = re.match(r'^#\s+(.+)', line)
                match_h2 = re.match(r'^##\s+(.+)', line)

                if match_h1:
                    title = match_h1.group(1).strip()
                    self._start_chapter(title)
                    self.current_content.append(line + '\n')
                    continue
                elif match_h2:
                    title = match_h2.group(1).strip()
                    self._start_topic(title)
                    self.current_content.append(line + '\n')
                    continue

            self.current_content.append(line + '\n')

        # Finalize
        self._flush_chapter()

        # Remove empty "General" chapter if it has no real content
        self.chapters = [c for c in self.chapters if c['topic_count'] > 0]

        # Write SKILL.md with embedded chapter catalog
        description = f"Documentation for {self.skill_name}. Use for questions about {self.skill_name} APIs, patterns, and usage."
        skill_md_content = generate_skill_md(
            self.skill_name,
            description,
            source,
            self.chapters,
            self.total_tokens,
            preserved_config
        )
        with open(os.path.join(self.base_dir, "SKILL.md"), 'w', encoding='utf-8') as f:
            f.write(skill_md_content)

        return {
            'chapters': len(self.chapters),
            'topics': sum(c['topic_count'] for c in self.chapters),
            'tokens': self.total_tokens
        }


def save_tracking_info(skill_dir: str, source: str, source_type: str, content_hash: str, skill_name: str, stats: dict):
    """Save .shardskill.json for update tracking."""
    tracking = {
        'source': source,
        'source_type': source_type,
        'content_hash': f"sha256:{content_hash}",
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'generator_version': VERSION,
        'skill_name': skill_name,
        'stats': stats
    }

    with open(os.path.join(skill_dir, '.shardskill.json'), 'w', encoding='utf-8') as f:
        json.dump(tracking, f, indent=2)


def load_tracking_info(skill_dir: str) -> dict | None:
    """Load .shardskill.json if it exists."""
    tracking_path = os.path.join(skill_dir, '.shardskill.json')
    if not os.path.exists(tracking_path):
        return None

    try:
        with open(tracking_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


def cmd_generate(args):
    """Handle 'generate' command."""
    source = args.input
    skills_dir = os.path.abspath(os.path.expanduser(args.dir))

    # Get content
    content, source_type = get_content(source)
    content_hash = compute_hash(content)

    # Determine skill name
    if args.name:
        skill_name = clean_filename(args.name)
    else:
        # Try to extract from first H1
        first_h1 = extract_first_h1(content)
        if first_h1:
            skill_name = clean_filename(first_h1)
        else:
            skill_name = derive_name_from_source(source)

    skill_dir = os.path.join(skills_dir, skill_name)

    # Check if skill exists
    preserved_config = {}
    if os.path.exists(skill_dir):
        if not args.force:
            print(f"❌ Skill '{skill_name}' already exists at:")
            print(f"   {skill_dir}")
            print("   Use --force to overwrite (config will be preserved)")
            sys.exit(1)

        # Preserve existing config
        preserved_config = preserve_skill_config(skill_dir)
        if preserved_config:
            print(f"📋 Preserving existing config: {list(preserved_config.keys())}")

        # Remove old skill
        shutil.rmtree(skill_dir)

    # Generate skill
    print(f"🔨 Generating skill '{skill_name}'...")
    generator = SkillGenerator(skill_name, skills_dir)
    stats = generator.generate(content, source, preserved_config)

    # Save tracking info
    save_tracking_info(skill_dir, source, source_type, content_hash, skill_name, stats)

    print(f"\n✅ Skill generated successfully!")
    print(f"   📂 Location: {skill_dir}")
    print(f"   📚 Chapters: {stats['chapters']}")
    print(f"   📄 Topics: {stats['topics']}")
    print(f"   🎯 Tokens: ~{stats['tokens']:,}")


def cmd_update(args):
    """Handle 'update' command."""
    skills_dir = os.path.abspath(os.path.expanduser(args.dir))

    if args.all:
        # Update all tracked skills
        skills_to_update = []
        if os.path.exists(skills_dir):
            for name in os.listdir(skills_dir):
                skill_dir = os.path.join(skills_dir, name)
                if os.path.isdir(skill_dir):
                    tracking = load_tracking_info(skill_dir)
                    if tracking:
                        skills_to_update.append((name, skill_dir, tracking))

        if not skills_to_update:
            print("❌ No tracked skills found to update")
            sys.exit(1)

        print(f"📋 Found {len(skills_to_update)} tracked skill(s)")
        for skill_name, skill_dir, tracking in skills_to_update:
            _update_skill(skill_name, skill_dir, tracking, args.force, skills_dir)
    else:
        skill_name = args.skill_name
        skill_dir = os.path.join(skills_dir, skill_name)

        if not os.path.exists(skill_dir):
            print(f"❌ Skill '{skill_name}' not found at:")
            print(f"   {skill_dir}")
            sys.exit(1)

        tracking = load_tracking_info(skill_dir)
        if not tracking:
            print(f"❌ Skill '{skill_name}' has no tracking info (.shardskill.json)")
            print("   This skill was not created by shardskill or tracking was removed")
            sys.exit(1)

        _update_skill(skill_name, skill_dir, tracking, args.force, skills_dir)


def _update_skill(skill_name: str, skill_dir: str, tracking: dict, force: bool, skills_dir: str):
    """Update a single skill from its tracked source."""
    print(f"\n🔄 Checking '{skill_name}'...")

    source = tracking['source']
    old_hash = tracking['content_hash'].replace('sha256:', '')

    # Fetch current content
    try:
        content, source_type = get_content(source)
    except SystemExit:
        print(f"   ⚠️  Could not fetch source, skipping")
        return

    new_hash = compute_hash(content)

    if new_hash == old_hash and not force:
        print(f"   ✓ No changes detected (hash unchanged)")
        return

    if new_hash == old_hash:
        print(f"   ⚠️  No changes detected, but --force specified")
    else:
        print(f"   📝 Changes detected, regenerating...")

    # Preserve config and regenerate
    preserved_config = preserve_skill_config(skill_dir)
    shutil.rmtree(skill_dir)

    generator = SkillGenerator(skill_name, skills_dir)
    stats = generator.generate(content, source, preserved_config)
    save_tracking_info(skill_dir, source, source_type, new_hash, skill_name, stats)

    print(f"   ✅ Updated! ({stats['chapters']} chapters, {stats['topics']} topics, ~{stats['tokens']:,} tokens)")


def cmd_list(args):
    """Handle 'list' command."""
    skills_dir = os.path.abspath(os.path.expanduser(args.dir))

    if not os.path.exists(skills_dir):
        print(f"❌ Skills directory not found: {skills_dir}")
        sys.exit(1)

    tracked_skills = []
    untracked_skills = []

    for name in sorted(os.listdir(skills_dir)):
        skill_dir = os.path.join(skills_dir, name)
        if not os.path.isdir(skill_dir):
            continue

        tracking = load_tracking_info(skill_dir)
        if tracking:
            tracked_skills.append((name, tracking))
        elif os.path.exists(os.path.join(skill_dir, 'SKILL.md')):
            untracked_skills.append(name)

    if not tracked_skills and not untracked_skills:
        print("📭 No skills found")
        return

    if tracked_skills:
        print("📋 Tracked Skills (can be updated):\n")
        for name, tracking in tracked_skills:
            source = tracking.get('source', 'unknown')
            generated = tracking.get('generated_at', 'unknown')[:10]
            hash_short = tracking.get('content_hash', '')[:20] + '...'
            stats = tracking.get('stats', {})

            print(f"  {name}")
            print(f"    Source: {source}")
            print(f"    Generated: {generated}")
            print(f"    Hash: {hash_short}")
            if stats:
                print(f"    Stats: {stats.get('chapters', '?')} chapters, {stats.get('topics', '?')} topics")
            print()

    if untracked_skills:
        print("📦 Untracked Skills (manual or legacy):\n")
        for name in untracked_skills:
            print(f"  {name}")


def main():
    parser = argparse.ArgumentParser(
        description='Generate Claude Code skills from llms.txt documentation files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  shardskill generate https://sdk.vercel.ai/llms.txt
  shardskill generate ./docs/llms.txt --name my-lib
  shardskill generate https://example.com/llms.txt --name my-skill --force
  shardskill update my-skill
  shardskill update --all
  shardskill list
"""
    )

    subparsers = parser.add_subparsers(dest='command', required=True)

    # Generate command
    gen_parser = subparsers.add_parser('generate', help='Generate a new skill from llms.txt')
    gen_parser.add_argument('input', help='URL or local file path to llms.txt')
    gen_parser.add_argument('--name', '-n', help='Skill name (auto-derived if omitted)')
    gen_parser.add_argument('--force', '-f', action='store_true', help='Overwrite existing skill')
    gen_parser.add_argument('--dir', '-d', default=DEFAULT_SKILLS_DIR, help='Output directory')

    # Update command
    upd_parser = subparsers.add_parser('update', help='Update skill from tracked source')
    upd_parser.add_argument('skill_name', nargs='?', help='Skill name to update')
    upd_parser.add_argument('--all', '-a', action='store_true', help='Update all tracked skills')
    upd_parser.add_argument('--force', '-f', action='store_true', help='Force update even if unchanged')
    upd_parser.add_argument('--dir', '-d', default=DEFAULT_SKILLS_DIR, help='Skills directory')

    # List command
    list_parser = subparsers.add_parser('list', help='List all skills with tracking info')
    list_parser.add_argument('--dir', '-d', default=DEFAULT_SKILLS_DIR, help='Skills directory')

    args = parser.parse_args()

    if args.command == 'generate':
        cmd_generate(args)
    elif args.command == 'update':
        if not args.skill_name and not args.all:
            print("❌ Please specify a skill name or use --all")
            sys.exit(1)
        cmd_update(args)
    elif args.command == 'list':
        cmd_list(args)


if __name__ == "__main__":
    main()
