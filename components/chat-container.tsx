'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { useThreads } from '@/providers/thread-provider';
import { useStreamContext } from '@/providers/stream-provider';

export function ChatContainer() {
  const { activeThreadId } = useThreads();

  const { messages, ...stream } = useStreamContext();

  const lastError = useRef<string | undefined>(undefined);

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
    <div className="flex flex-col h-full">
      {/* {JSON.stringify(messages)} */}
      <ScrollArea className="flex-1 p-4">
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
          </div>
        </div>
      </ScrollArea>

      <ChatInput />
    </div>
  );
}
