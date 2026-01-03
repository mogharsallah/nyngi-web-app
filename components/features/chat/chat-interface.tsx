'use client'

import { MessageAction, MessageActions } from '@/components/features/ai/message'
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/features/ai/conversation'
import { Message, MessageContent } from '@/components/features/ai/message'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/features/ai/prompt-input'

import { MessageResponse } from '@/components/features/ai/message'

import { CopyIcon, RefreshCcwIcon } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useStudioStore } from '@/components/providers'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'

export const ChatInterface = () => {
  const [text, setText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const currentSessionId = useStudioStore((state) => state.currentSessionId)

  // Custom transport that only sends the last message (server has history in DB)
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/chat/${currentSessionId}/criteria`,
        prepareSendMessagesRequest: ({ messages }) => {
          // Only send the last user message - server fetches history from DB
          const lastMessage = messages[messages.length - 1]
          return {
            body: { message: lastMessage },
          }
        },
      }),
    [currentSessionId]
  )

  const { messages, setMessages, sendMessage, status, regenerate } = useChat({
    transport,
  })

  // Load initial messages from DB on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chat/${currentSessionId}/criteria`)
        if (response.ok) {
          const data = await response.json()
          if (data.messages?.length > 0) {
            setMessages(data.messages as UIMessage[])
          }
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadMessages()
  }, [currentSessionId, setMessages])

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text.trim())
    const hasAttachments = Boolean(message.files?.length)

    if (!(hasText || hasAttachments)) {
      return
    }

    if (message.files?.length) {
      toast.success('Files attached', {
        description: `${message.files.length} file(s) attached to message`,
      })
    }

    sendMessage({
      text: message.text,
      files: message.files,
    })
    setText('')
  }

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading conversation...</div>
      </div>
    )
  }

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <Conversation>
        <ConversationContent>
          {messages.map((message, messageIndex) => {
            const messageKey = message.id || `msg-${messageIndex}`
            return (
              <Fragment key={messageKey}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      const isLastMessage = messageIndex === messages.length - 1
                      return (
                        <Fragment key={`${messageKey}-${i}`}>
                          <Message from={message.role}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                          {message.role === 'assistant' && isLastMessage && (
                            <MessageActions>
                              <MessageAction onClick={() => regenerate()} label="Retry">
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction onClick={() => navigator.clipboard.writeText(part.text)} label="Copy">
                                <CopyIcon className="size-3" />
                              </MessageAction>
                            </MessageActions>
                          )}
                        </Fragment>
                      )
                    default:
                      return null
                  }
                })}
              </Fragment>
            )
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 pt-4">
        <div className="w-full px-4 pb-4">
          <PromptInput globalDrop multiple onSubmit={handleSubmit}>
            <PromptInputHeader>
              <PromptInputAttachments>{(attachment) => <PromptInputAttachment data={attachment} />}</PromptInputAttachments>
            </PromptInputHeader>
            <PromptInputBody>
              <PromptInputTextarea autoFocus onChange={(event) => setText(event.target.value)} value={text} />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent>
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
              </PromptInputTools>
              <PromptInputSubmit disabled={!(text.trim() || status) || status === 'streaming'} status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}
