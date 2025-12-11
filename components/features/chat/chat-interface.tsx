'use client'

import { useStudioStore } from '@/components/providers/studio-store-provider'
import { Button } from '@/components/ui/button'
import { establishCriteria } from '@/server/actions/studio'
import { act, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import type { establishingCriteriaAgent } from '@/server/agents/establishing-criteria'
import { DefaultChatTransport, InferAgentUIMessage, TextStreamChatTransport } from 'ai'

export function ChatInterface() {
  const currentSessionPlan = useStudioStore((state) => state.currentSessionPlan)
  const currentSessionId = useStudioStore((state) => state.currentSessionId)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat/${currentSessionId}/criteria`,
    }),
  })
  const [input, setInput] = useState('')

  return (
    <>
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) => (part.type === 'text' ? <span key={index}>{part.text}</span> : null))}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            sendMessage({ text: input })
            setInput('')
          }
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} disabled={status !== 'ready'} placeholder="Say something..." />
        <button type="submit" disabled={status !== 'ready'}>
          Submit
        </button>
      </form>
    </>
  )
}
