'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDown } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { useThreads } from '@/providers/thread-provider';
import { useStreamContext } from '@/providers/stream-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useInputHeight } from '@/providers/input-height-provider';

export function ChatContainer() {
  const { activeThreadId } = useThreads();
  const { inputHeight } = useInputHeight();

  const { messages, ...stream } = useStreamContext();

  const lastError = useRef<string | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll to bottom on initial render and when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check if user has scrolled up
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  // Scroll to bottom on initial render
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Error handling
  useEffect(() => {
    if (!stream.error) {
      lastError.current = undefined;
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const chatStarted = !!activeThreadId || !!messages.length;
  const hasNoAIOrToolMessages = !messages.find(
    (m) => m.type === 'ai' || m.type === 'tool',
  );
  return (
    <div className="flex flex-col h-full relative">
      {/* {JSON.stringify(messages)} */}
      <div 
        className="flex-1 p-4 overflow-auto" 
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        <div className="flex flex-col justify-end min-h-full">
          <div className="space-y-4 max-w-3xl mx-auto w-full">
            {messages.length === 0 ? (
              <div className="text-left">
                <h2 className="text-2xl font-semibold">Hello there!</h2>
                <p className="text-xl text-muted-foreground">How can I help you today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage
                  key={message.id || `${message.type}-${index}`}
                  message={message}
                  isLoading={stream.isLoading}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Scroll to bottom button */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 z-10 transition-all duration-200"
        style={{ bottom: `${inputHeight + 8}px` }} // Position just above the input box with 8px gap
      >
        <Button
          onClick={scrollToBottom}
          size="icon"
          variant="secondary"
          className={cn(
            'rounded-full h-9 w-9 bg-gray-900 hover:bg-gray-700 flex items-center justify-center shadow-md transition-opacity duration-200',
            showScrollButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-5 w-5 text-white" />
        </Button>
      </div>

      <ChatInput />
    </div>
  );
}
