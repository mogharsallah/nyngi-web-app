#!/usr/bin/env python3
"""
set_description - Update skill description in SKILL.md frontmatter.

Usage:
    set_description <skill-name> <description> [--dir DIR]
"""

import os
import sys
import argparse

DEFAULT_SKILLS_DIR = os.path.join(".", ".claude", "skills")


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from markdown content."""
    if not content.startswith('---'):
        return {}, content

    end = content.find('---', 3)
    if end == -1:
        return {}, content

    frontmatter_str = content[3:end].strip()
    body = content[end + 3:].lstrip('\n')

    # Simple YAML parsing (key: value)
    frontmatter = {}
    for line in frontmatter_str.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()

    return frontmatter, body


def serialize_frontmatter(frontmatter: dict) -> str:
    """Serialize frontmatter dict back to YAML string."""
    return '\n'.join(f"{k}: {v}" for k, v in frontmatter.items())


def set_description(skill_name: str, description: str, skills_dir: str = DEFAULT_SKILLS_DIR):
    """Update the description in a skill's SKILL.md frontmatter."""
    skill_dir = os.path.join(skills_dir, skill_name)
    skill_md_path = os.path.join(skill_dir, "SKILL.md")

    if not os.path.exists(skill_md_path):
        print(f"❌ Skill '{skill_name}' not found at:")
        print(f"   {skill_md_path}")
        sys.exit(1)

    # Read existing content
    with open(skill_md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse frontmatter
    frontmatter, body = parse_frontmatter(content)

    if not frontmatter:
        print(f"❌ Could not parse frontmatter in {skill_md_path}")
        sys.exit(1)

    # Update description
    old_description = frontmatter.get('description', '')
    frontmatter['description'] = description

    # Rebuild content
    new_content = f"---\n{serialize_frontmatter(frontmatter)}\n---\n{body}"

    # Write back
    with open(skill_md_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"✅ Updated description for '{skill_name}'")
    print(f"   Old: {old_description[:80]}{'...' if len(old_description) > 80 else ''}")
    print(f"   New: {description[:80]}{'...' if len(description) > 80 else ''}")


def main():
    parser = argparse.ArgumentParser(
        description='Update skill description in SKILL.md frontmatter'
    )
    parser.add_argument('skill_name', help='Name of the skill to update')
    parser.add_argument('description', help='New description for the skill')
    parser.add_argument('--dir', '-d', default=DEFAULT_SKILLS_DIR, help='Skills directory')

    args = parser.parse_args()
    set_description(args.skill_name, args.description, args.dir)


if __name__ == "__main__":
    main()
