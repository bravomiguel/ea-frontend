'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@langchain/langgraph-sdk';
import { ArrowDown } from 'lucide-react';
import { ChatMessage } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { useStreamContext } from '@/providers/stream-provider';
import { Button } from '@/components/ui/button';
import { cn, hasToolCalls } from '@/lib/utils';
import { useInputHeight } from '@/providers/input-height-provider';
import { AIUpdate } from './ai-update';
import { useComposioContext } from '@/providers/composio-provider';
import { ConnectGmailCard } from '@/components/connect-gmail-card';
import { StarterPrompts } from '@/components/starter-prompts';

export function ChatContainer() {
  const { inputHeight } = useInputHeight();
  const { hasGmailConnection, handleConnect, isConnecting } = useComposioContext();

  const { messages, submit, ...stream } = useStreamContext();
  const { data: session } = useSession();
  const lastMessage = messages[messages.length - 1];

  const lastError = useRef<string | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastMessageLengthRef = useRef<number>(0);
  const lastMessagesLengthRef = useRef<number>(0);

  // Scroll to bottom on initial render and when new messages arrive
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  // Check if user has scrolled up
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    const isScrolledUp = !isAtBottom;

    setShowScrollButton(isScrolledUp);
    setShouldAutoScroll(isAtBottom);
  };
  
  // Handle prompt click from starter prompts
  const handlePromptClick = (prompt: string) => {
    if (!session?.user?.id) return;
    
    const newHumanMessage: Message = {
      id: uuidv4(),
      type: 'human',
      content: prompt,
    };
    
    submit(
      {
        messages: [newHumanMessage],
      },
      {
        config: {
          configurable: {
            user_id: session.user.id,
          },
        },
        streamMode: ['values'],
        optimisticValues: (prev) => ({
          ...prev,
          messages: [...(prev.messages ?? []), newHumanMessage],
        }),
      }
    );
  };

  // Scroll to bottom on initial render
  useEffect(() => {
    scrollToBottom(false);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    // If a new message has been added
    if (messages.length > lastMessagesLengthRef.current) {
      lastMessagesLengthRef.current = messages.length;
      scrollToBottom();
    }
  }, [messages.length]);

  // Auto-scroll when content of the last message changes (streaming)
  useEffect(() => {
    if (messages.length === 0) return;

    if (!lastMessage || lastMessage.type !== 'ai') return;

    const content =
      typeof lastMessage.content === 'string'
        ? lastMessage.content
        : JSON.stringify(lastMessage.content);

    const currentLength = content.length;

    // If the message is growing (streaming) and we should auto-scroll
    if (currentLength > lastMessageLengthRef.current && shouldAutoScroll) {
      scrollToBottom(false); // Use instant scroll for streaming for smoother experience
    }

    lastMessageLengthRef.current = currentLength;
  }, [messages, shouldAutoScroll, lastMessage]);

  // Error handling
  useEffect(() => {
    if (!stream.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (stream.error as any).message;
      if (!message || lastError.current === message) {
        // Message has already been logged. do not modify ref, return early.
        return;
      }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      lastError.current = message;
      toast.error('An error occurred. Please try again.', {
        description: (
          <p>
            <strong>Error:</strong> <code>{message}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });
    } catch {
      // no-op
    }
  }, [stream.error]);

  // const chatStarted = !!activeThreadId || !!messages.length;
  // const hasNoAIOrToolMessages = !messages.find(
  //   (m) => m.type === 'ai' || m.type === 'tool',
  // );
  return (
    <div className="flex flex-col h-full relative px-4">
      <div
        className="flex-1 p-4 overflow-auto"
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        <div
          className={cn('flex flex-col justify-start min-h-full', {
            'justify-center': messages.length === 0 || !hasGmailConnection,
          })}
        >
          {!hasGmailConnection ? (
            <ConnectGmailCard />
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto w-full">
              {messages.length === 0 ? (
                <>
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold">Hello there!</h2>
                    <p className="text-xl text-muted-foreground">
                      How can I help you today?
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {messages
                    .filter(
                      (message) =>
                        ['ai', 'human'].includes(message.type) &&
                        !hasToolCalls(message),
                    )
                    .map((message, index) => (
                      <ChatMessage
                        key={message.id || `${message.type}-${index}`}
                        message={message}
                      />
                    ))}

                  <AIUpdate />
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button - Only show when hasGmailConnection is true */}
      {hasGmailConnection && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 z-10 transition-all duration-200"
          style={{ bottom: `${inputHeight + 8}px` }} // Position just above the input box with 8px gap
        >
          <Button
            onClick={(e) => scrollToBottom(true)}
            size="icon"
            variant="secondary"
            className={cn(
              'rounded-full h-8 w-8 bg-gray-900 hover:bg-gray-700 flex items-center justify-center shadow-md transition-opacity duration-200',
              showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="h-5 w-5 text-white" />
          </Button>
        </div>
      )}

      {/* Show starter prompts when there are no messages and viewport is wide enough */}
      {hasGmailConnection && messages.length === 0 && (
        <div className="max-w-3xl mx-auto w-full pb-2 hidden lg:block">
          <StarterPrompts onPromptClick={handlePromptClick} />
        </div>
      )}

      {/* Only show ChatInput when hasGmailConnection is true */}
      {hasGmailConnection && <ChatInput />}
    </div>
  );
}
