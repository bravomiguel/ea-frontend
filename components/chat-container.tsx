'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Message, Checkpoint } from '@langchain/langgraph-sdk';
import { v4 as uuidv4 } from 'uuid';

// import { ScrollArea } from '@/components/ui/scroll-area';
// import { ChatMessage, ChatMessageProps } from '@/components/chat-message';
// import { ChatInput } from '@/components/chat-input';
import { useThreads } from '@/providers/thread-provider';
import { useStreamContext } from '@/providers/stream-provider';

export function ChatContainer() {
  // const [threadId, setThreadId] = useQueryState('threadId');
  const { activeThreadId, setActiveThreadId } = useThreads();

  const [input, setInput] = useState('');

  const [firstTokenReceived, setFirstTokenReceived] = useState(false);

  const stream = useStreamContext();
  const messages = stream.messages;
  const isLoading = stream.isLoading;

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

  // TODO: this should be part of the useStream hook
  const prevMessageLength = useRef(0);
  useEffect(() => {
    if (
      messages.length !== prevMessageLength.current &&
      messages?.length &&
      messages[messages.length - 1].type === 'ai'
    ) {
      setFirstTokenReceived(true);
    }

    prevMessageLength.current = messages.length;
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: 'human',
      content: input,
    };

    // const toolMessages = ensureToolCallsHaveResponses(stream.messages);
    stream.submit(
      {
        messages: [
          // ...toolMessages,
          newHumanMessage,
        ],
      },
      {
        streamMode: ['values'],
        optimisticValues: (prev) => ({
          ...prev,
          messages: [
            ...(prev.messages ?? []),
            // ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );

    setInput('');
  };

  const handleRegenerate = (
    parentCheckpoint: Checkpoint | null | undefined,
  ) => {
    // Do this so the loading state is correct
    prevMessageLength.current = prevMessageLength.current - 1;

    setFirstTokenReceived(false);

    stream.submit(undefined, {
      checkpoint: parentCheckpoint,
      streamMode: ['values'],
    });
  };

  const chatStarted = !!activeThreadId || !!messages.length;
  const hasNoAIOrToolMessages = !messages.find(
    (m) => m.type === 'ai' || m.type === 'tool',
  );
  return (
    <div className="flex flex-col h-full">
      {JSON.stringify(messages)}
      {/* <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col justify-end min-h-full">
          <div className="space-y-4 max-w-3xl mx-auto w-full">
            <ChatMessage
              role="assistant"
              content={`Hello there!\nHow can I help you today?${
                threadId ? ` (Thread ID: ${threadId})` : ''
              }`}
            />

            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}

            {isLoading && (
              <ChatMessage role="assistant" content="" isLoading={true} />
            )}
          </div>
        </div>
      </ScrollArea>

      <ChatInput onSend={handleSendMessage} disabled={isLoading} /> */}
    </div>
  );
}
