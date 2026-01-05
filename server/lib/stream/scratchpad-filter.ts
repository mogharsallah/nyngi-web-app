import type { TextStreamPart, ToolSet, StreamTextTransform, UIMessage } from 'ai'

const OPEN_TAG = '<scratchpad>'
const CLOSE_TAG = '</scratchpad>'
const SCRATCHPAD_REGEX = /<scratchpad>[\s\S]*?<\/scratchpad>/g

/**
 * Filters scratchpad content from a string
 */
export function filterScratchpadFromText(text: string): string {
  return text.replace(SCRATCHPAD_REGEX, '')
}

/**
 * Filters scratchpad content from UIMessages (for initial page load)
 * Use this when loading messages from the database to display to users.
 */
export function filterScratchpadFromMessages(messages: UIMessage[]): UIMessage[] {
  return messages.map((message) => ({
    ...message,
    parts: message.parts.map((part) => {
      if (part.type === 'text') {
        return { ...part, text: filterScratchpadFromText(part.text) }
      }
      return part
    }),
  }))
}

/**
 * Creates a capturing scratchpad filter that:
 * 1. Filters scratchpad content from the stream (for client display)
 * 2. Captures original text (for storage)
 *
 * Use getOriginalText() after streaming completes to retrieve the unfiltered text.
 */
export function createCapturingScratchpadFilter<TOOLS extends ToolSet>(): {
  transform: StreamTextTransform<TOOLS>
  getOriginalText: () => string
} {
  let originalText = ''

  const transform: StreamTextTransform<TOOLS> = () => {
    let inScratchpad = false
    let pendingText = '' // Only holds potential partial tags

    return new TransformStream<TextStreamPart<TOOLS>, TextStreamPart<TOOLS>>({
      transform(chunk, controller) {
        // Pass through non-text parts unchanged
        if (chunk.type !== 'text-delta') {
          controller.enqueue(chunk)
          return
        }

        // Capture ORIGINAL text before any filtering
        originalText += chunk.text

        let text = pendingText + chunk.text
        pendingText = ''
        let output = ''

        while (text.length > 0) {
          if (!inScratchpad) {
            // Look for opening tag
            const openIdx = text.indexOf(OPEN_TAG)

            if (openIdx === -1) {
              // No complete tag - check for partial at end
              // Only buffer if text ends with start of '<scratchpad>'
              let partialLen = 0
              for (let len = Math.min(text.length, OPEN_TAG.length - 1); len > 0; len--) {
                if (OPEN_TAG.startsWith(text.slice(-len))) {
                  partialLen = len
                  break
                }
              }

              if (partialLen > 0) {
                output += text.slice(0, -partialLen)
                pendingText = text.slice(-partialLen)
              } else {
                output += text
              }
              text = ''
            } else {
              // Found opening tag - output everything before it
              output += text.slice(0, openIdx)
              text = text.slice(openIdx + OPEN_TAG.length)
              inScratchpad = true
            }
          } else {
            // Inside scratchpad - look for closing tag
            const closeIdx = text.indexOf(CLOSE_TAG)

            if (closeIdx === -1) {
              // No complete closing tag - check for partial at end
              let partialLen = 0
              for (let len = Math.min(text.length, CLOSE_TAG.length - 1); len > 0; len--) {
                if (CLOSE_TAG.startsWith(text.slice(-len))) {
                  partialLen = len
                  break
                }
              }

              if (partialLen > 0) {
                pendingText = text.slice(-partialLen)
              }
              // Discard scratchpad content (don't add to output)
              text = ''
            } else {
              // Found closing tag - discard everything up to and including it
              text = text.slice(closeIdx + CLOSE_TAG.length)
              inScratchpad = false
            }
          }
        }

        // Emit filtered text immediately if there's any
        if (output) {
          controller.enqueue({ ...chunk, text: output })
        }
      },

      flush(controller) {
        // On stream end, emit any pending text if not in scratchpad
        if (pendingText && !inScratchpad) {
          controller.enqueue({ type: 'text-delta', id: 'flush', text: pendingText } as unknown as TextStreamPart<TOOLS>)
        }
      },
    })
  }

  return {
    transform,
    getOriginalText: () => originalText,
  }
}
