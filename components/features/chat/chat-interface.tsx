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
import { Fragment, useState } from 'react'
import { toast } from 'sonner'
import { useStudioStore } from '@/components/providers'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

export const ChatInterface = () => {
  const [text, setText] = useState<string>('')
  const currentSessionId = useStudioStore((state) => state.currentSessionId)

  const { messages, sendMessage, status, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/chat/${currentSessionId}/criteria`,
    }),
  })

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

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <Conversation>
        <ConversationContent>
          {messages.map((message, messageIndex) => (
            <Fragment key={message.id}>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    const isLastMessage = messageIndex === messages.length - 1
                    return (
                      <Fragment key={`${message.id}-${i}`}>
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
          ))}
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
