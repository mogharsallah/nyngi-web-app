'use client'

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

import { Fragment, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'

interface ChatInterfaceProps {
  sessionId: string
  initialMessages: UIMessage[]
}

export const ChatInterface = ({ sessionId, initialMessages }: ChatInterfaceProps) => {
  const [text, setText] = useState<string>('')

  // Custom transport that only sends the last message (server has history in DB)
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `/api/chat/${sessionId}/criteria`,
        prepareSendMessagesRequest: ({ messages }) => {
          // Only send the last user message - server fetches history from DB
          const lastMessage = messages[messages.length - 1]
          return {
            body: { message: lastMessage },
          }
        },
      }),
    [sessionId]
  )

  const { messages, sendMessage, status, addToolApprovalResponse } = useChat({
    id: sessionId,
    messages: initialMessages, // Server-loaded messages passed as props
    transport,
    // Auto-submit after tool approval responses are added
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
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
          {messages.map((message, messageIndex) => {
            const messageKey = message.id || `msg-${messageIndex}`
            return (
              <Fragment key={messageKey}>
                {message.parts.map((part, i) => {
                  const partKey = `${messageKey}-${i}`

                  // Handle text parts
                  if (part.type === 'text') {
                    return (
                      <Fragment key={partKey}>
                        <Message from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        </Message>
                      </Fragment>
                    )
                  }

                  // Handle handover tool approval
                  if (part.type === 'tool-handover') {
                    if (part.state === 'approval-requested') {
                      return (
                        <div key={partKey} className="my-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <ArrowRight className="size-5 text-primary" />
                            <h4 className="font-medium">Ready for Brainstorming</h4>
                          </div>
                          <p className="mb-4 text-sm text-muted-foreground">
                            The criteria brief is complete. Would you like to proceed to the brainstorming phase?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                addToolApprovalResponse({
                                  id: part.approval.id,
                                  approved: true,
                                })
                              }
                            >
                              <CheckCircle className="mr-2 size-4" />
                              Proceed to Brainstorming
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addToolApprovalResponse({
                                  id: part.approval.id,
                                  approved: false,
                                })
                              }
                            >
                              <XCircle className="mr-2 size-4" />
                              Continue Refining
                            </Button>
                          </div>
                        </div>
                      )
                    }

                    if (part.state === 'output-available') {
                      return (
                        <div key={partKey} className="my-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="size-5 text-green-600" />
                            <span className="font-medium text-green-700">Transitioned to Brainstorming Phase</span>
                          </div>
                        </div>
                      )
                    }
                  }

                  return null
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
