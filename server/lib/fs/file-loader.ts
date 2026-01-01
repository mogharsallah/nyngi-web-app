import fs from 'fs'
import path from 'path'

/**
 * Reads a markdown file from the project root.
 * @param relativePath - Path relative to the project root (e.g., 'src/server/agents/instructions/file.md')
 * @returns The string content of the file
 */
export function loadMarkdown(relativePath: string): string {
  try {
    const fullPath = path.join(process.cwd(), relativePath)
    return fs.readFileSync(fullPath, 'utf8')
  } catch (error) {
    console.error(`Error loading markdown file at ${relativePath}:`, error)
    throw new Error(`Failed to load markdown file: ${relativePath}`)
  }
}
