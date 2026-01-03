import os
import re
import argparse
import sys
import shutil

def clean_filename(name):
    """Sanitizes strings to be safe filenames and folder names."""
    clean = re.sub(r'\s+', '-', name.lower())
    clean = re.sub(r'[^a-z0-9-]', '', clean)
    return clean[:60]

def generate_skill_md(skill_name, description):
    return f"""---
name: {skill_name}
description: {description}
---

# {skill_name} Instructions

You have access to a massive documentation set for {skill_name}.
The content is organized into **Chapters** to be token-efficient.

**Retrieval Workflow:**
1.  **Find the Chapter**: Read `_manifest.md` (in the root) to find the broad category.
2.  **Find the Topic**: Read the `_index.md` file *inside* that chapter's folder.
3.  **Read the Content**: Read the specific markdown file to answer.

## Rules
- **Start at `_manifest.md`**.
- Do not guess file paths.
- If unsure, use `grep -r "search_term" docs/` to find keywords.
"""

def split_llms_txt(input_file, skill_name, output_root):
    # Resolve the output root relative to current working directory
    # If output_root is ".claude/skills", it creates ./claude/skills in current dir
    resolved_root = os.path.abspath(os.path.expanduser(output_root))
    base_dir = os.path.join(resolved_root, skill_name)
    docs_dir = os.path.join(base_dir, "docs")
    
    # --- SAFETY CHECK: Fail if skill exists ---
    if os.path.exists(base_dir):
        print(f"❌ Error: A skill named '{skill_name}' already exists at:")
        print(f"   {base_dir}")
        print("   Aborting to prevent data loss. Please choose a different name or delete the folder manually.")
        sys.exit(1)

    # Create directories (including parent .claude/skills if missing)
    try:
        os.makedirs(docs_dir)
    except OSError as e:
        print(f"❌ Error creating directory {docs_dir}: {e}")
        sys.exit(1)

    # Master Manifest (Lists Chapters)
    master_manifest = []
    
    # State Tracking
    current_chapter_dir = None
    current_chapter_title = "General"
    current_chapter_index = []  
    
    # File Buffer
    current_file_path = None
    current_content = []
    
    # Helper: Flush file to disk
    def flush_file():
        if current_file_path and current_content:
            with open(current_file_path, 'w', encoding='utf-8') as out:
                out.writelines(current_content)
            return True
        return False

    # Helper: Flush Chapter Index
    def flush_chapter_index():
        if current_chapter_dir and current_chapter_index:
            index_path = os.path.join(current_chapter_dir, "_index.md")
            with open(index_path, 'w', encoding='utf-8') as idx:
                idx.write(f"# Chapter Index: {current_chapter_title}\n\n")
                idx.write("\n".join(current_chapter_index))
            
            # Add to Master Manifest
            rel_path = os.path.join("docs", os.path.basename(current_chapter_dir), "_index.md")
            master_manifest.append(f"- [{current_chapter_title}]({rel_path})")

    print(f"📖 Reading {input_file}...")
    
    # Initial setup for "General" content (preamble)
    current_chapter_dir = os.path.join(docs_dir, "00-general")
    os.makedirs(current_chapter_dir, exist_ok=True)
    current_file_path = os.path.join(current_chapter_dir, "overview.md")
    current_chapter_index.append("- [Overview](overview.md)")

    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            # H1: New Chapter
            match_h1 = re.match(r'^#\s+(.+)', line)
            # H2: New Topic
            match_h2 = re.match(r'^##\s+(.+)', line)
            
            if match_h1:
                flush_file()
                flush_chapter_index()
                
                # Start New Chapter
                raw_title = match_h1.group(1).strip()
                folder_name = clean_filename(raw_title)
                current_chapter_dir = os.path.join(docs_dir, folder_name)
                os.makedirs(current_chapter_dir, exist_ok=True)
                
                current_chapter_title = raw_title
                current_chapter_index = []
                
                # H1 content goes to overview.md
                current_file_path = os.path.join(current_chapter_dir, "overview.md")
                current_content = [line]
                current_chapter_index.append(f"- [Overview](overview.md)")

            elif match_h2:
                flush_file()
                
                # Start New File
                raw_title = match_h2.group(1).strip()
                filename = clean_filename(raw_title) + ".md"
                current_file_path = os.path.join(current_chapter_dir, filename)
                current_content = [line]
                
                current_chapter_index.append(f"- [{raw_title}]({filename})")
                
            else:
                current_content.append(line)
    
    # Save final buffers
    flush_file()
    flush_chapter_index()

    # --- Write Master Manifest ---
    manifest_path = os.path.join(base_dir, "_manifest.md")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        f.write(f"# Documentation Catalog for {skill_name}\n\n")
        f.write("Select a Chapter below to view its contents.\n\n")
        f.write("\n".join(master_manifest))

    # --- Write SKILL.md ---
    desc = f"Documentation for {skill_name}. Organized by Chapter > Topic."
    with open(os.path.join(base_dir, "SKILL.md"), 'w', encoding='utf-8') as f:
        f.write(generate_skill_md(skill_name, desc))

    print(f"\n✅ Skill generated successfully!")
    print(f"   📂 Location: {base_dir}")
    print(f"   📚 Chapters: {len(master_manifest)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Split llms.txt into a Project-Local Claude Skill')
    parser.add_argument('input_file', help='Path to llms.txt')
    parser.add_argument('--name', required=True, help='Name of the skill (e.g., vercel-ai-sdk)')
    
    # CHANGED: Default is now .claude/skills inside current directory
    default_dir = os.path.join(".", ".claude", "skills")
    parser.add_argument('--dir', default=default_dir, help=f'Base folder (Default: {default_dir})')
    
    args = parser.parse_args()
    split_llms_txt(args.input_file, args.name, args.dir)